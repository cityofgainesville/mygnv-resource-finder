const passport = require('passport');
const ms = require('ms');
const JWT = require('jsonwebtoken');
const User = require('../models/UserSchema');
const RefreshToken = require('../models/RefreshTokenSchema');
const crypto = require('crypto');

const roles = require('../config/roles');

const dotenv = require('dotenv');
dotenv.config();

// These should be in .env
// secret (generated using `openssl rand -base64 48` from console)
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm = process.env.JWT_ALGORITHM;
const jwtExpiresIn = ms(process.env.JWT_EXPIRATION);
const refreshTokenExpiration = ms(process.env.REFRESH_TOKEN_EXPIRATION);

// Register a new user, using email and password fields from body
// If the user registering the new account is not an admin, make the account with no privileges.
exports.register = async (req, res, next) => {
  req.body.role = req.body.role ? req.body.role : roles.EDITOR;
  if (req.user?.role !== roles.OWNER) {
    req.body.location_can_edit = [];
    req.body.resource_can_edit = [];
    req.body.cat_can_edit_resource_in = [];
    req.body.role = roles.EDITOR;
  }
  const newUser = new User(req.body);
  User.register(newUser, req.body.password, async (err, user) => {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    } else {
      const jwtToken = generateJwtToken(user);
      const refreshToken = generateRefreshToken(user, req.ip);
      await refreshToken.save();
      // If not already logged on
      if (!req.user) {
        setRefreshTokenCookie(res, refreshToken);
      }
      res.json({
        success: true,
        user: User.basicUserData(user),
        token: jwtToken,
        refreshToken: refreshToken.token,
      });
    }
  });
};

// Login a user, get JWT on success
exports.login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.json({ success: false, message: `Login Error: ${err} ` });
    }
    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid username or password',
      });
    } else {
      req.login(user, async (err) => {
        if (err) {
          return res.json({
            success: false,
            message: `Login Error: ${err} `,
          });
        }
        const jwtToken = generateJwtToken(user);
        const refreshToken = generateRefreshToken(user, req.ip);
        await refreshToken.save();
        setRefreshTokenCookie(res, refreshToken);
        res.json({
          success: true,
          user: User.basicUserData(user),
          token: jwtToken,
          refreshToken: refreshToken.token,
        });
      });
    }
  })(req, res);
};

exports.refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken
    ? req.cookies.refreshToken
    : req.body.token;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  const refreshToken = await RefreshToken.findOne({
    token: token,
  }).populate('user');

  const ipAddress = req.ip;

  if (!refreshToken?.isActive) {
    return res.status(401).json({ message: 'Refresh token is revoked' });
  }

  const newRefreshToken = generateRefreshToken(refreshToken.user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(refreshToken.user);

  res.json({
    success: true,
    user: User.basicUserData(refreshToken.user),
    token: jwtToken,
    refreshToken: newRefreshToken.token,
  });
};

exports.revokeToken = async (req, res, next) => {
  const token = req.cookies.refreshToken
    ? req.cookies.refreshToken
    : req.body.token;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  const ipAddress = req.ip;

  const refreshToken = await RefreshToken.findOne({
    token: token,
  }).populate('user');

  if (!refreshToken?.isActive) {
    return res.status(401).json({ message: 'Refresh token already revoked' });
  }

  // users can revoke their own tokens and admins can revoke any tokens
  if (refreshToken?.user.id !== req.user.id && req.user.role !== roles.OWNER) {
    return res.status(401).end();
  }

  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
  res.json({ success: true });
};

const generateJwtToken = (user) => {
  // Create a signed token
  return JWT.sign(
    // payload
    {
      id: user._id,
    },
    // secret
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString(),
    }
  );
};

const generateRefreshToken = (user, ipAddress) => {
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + refreshTokenExpiration),
    createdByIp: ipAddress,
  });
};

function randomTokenString() {
  return crypto.randomBytes(256).toString('base64');
}

// Checks if user is currently logged in, ie. if their token is valid
exports.isLoggedIn = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'User is logged in',
      user: req.user,
    });
  } else {
    res.json({ success: false, message: 'User is not logged in' });
  }
};

// Update the currently logged in user
const currentUserUpdate = async (req, res) => {
  try {
    const currentUser = req.user;
    const infoToUpdate = req.body;
    if (currentUser.role === roles.OWNER) {
      for (const key in infoToUpdate) {
        if (
          Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
          key !== 'password' &&
          key !== 'old_password' &&
          key !== 'updated_at' &&
          key !== 'created_at' &&
          key !== '_id' &&
          key !== '__v'
        ) {
          currentUser[key] = infoToUpdate[key];
        }
      }
    } else {
      currentUser.first_name = infoToUpdate.first_name;
      currentUser.last_name = infoToUpdate.last_name;
    }
    if (infoToUpdate.password !== undefined && infoToUpdate.password !== '') {
      await currentUser.changePassword(
        infoToUpdate.old_password,
        infoToUpdate.password
      );
    }
    await currentUser.save();
    res.json({ success: true, user: currentUser });
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

const adminUpdate = async (req, res) => {
  try {
    const currentUser = req.user;
    const infoToUpdate = req.body;
    const userToUpdate = req.userToUpdate;

    if (!userToUpdate) return res.status(404).end();

    if (currentUser.role !== roles.OWNER) return res.status(403).end();

    for (const key in infoToUpdate) {
      if (
        Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
        key !== 'password' &&
        key !== 'old_password' &&
        key !== 'updated_at' &&
        key !== 'created_at' &&
        key !== '_id' &&
        key !== '__v'
      ) {
        userToUpdate[key] = infoToUpdate[key];
      }
    }
    if (infoToUpdate.password !== undefined && infoToUpdate.password !== '') {
      await userToUpdate.setPassword(infoToUpdate.password);
    }
    await userToUpdate.save();
    res.json({ success: true, user: userToUpdate });
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

// Update a user
exports.update = async (req, res) => {
  if (req.userToUpdate && req.user.role === roles.OWNER)
    await adminUpdate(req, res);
  else await currentUserUpdate(req, res);
};

// Get all the users
/* 
  Accepts query parameters in this format
  categories=true // or false
  resources=true // or false
  locations=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.list = (req, res) => {
  // if (req.user.role !== roles.OWNER) res.status(403).end();
  let populateOptions = [];
  if (req.query.categories === 'true')
    populateOptions = [...populateOptions, 'cat_can_edit_provider_in'];
  if (req.query.resources === 'true')
    populateOptions = [...populateOptions, 'resource_can_edit'];
  if (req.query.locations === 'true')
    populateOptions = [...populateOptions, 'location_can_edit'];
  User.find({})
    .populate(...populateOptions)
    .exec((err, users) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(users);
      }
    });
};

exports.read = (req, res) => {
  if (req.user.role === roles.OWNER) res.json(req.userToUpdate);
  else res.status(403).end();
};

// Delete a user
exports.delete = (req, res) => {
  const user = req.userToUpdate;
  User.deleteOne(user, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.json({ success: true });
  });
};

// Middleware to get a user from database by ID, save in req.userToUpdate
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.userToUpdate = user;
      req.id = id;
      next();
    }
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  // create http only cookie with refresh token that expires
  const cookieOptions = {
    httpOnly: true,
    expires: refreshToken.expires,
  };
  res.cookie('refreshToken', refreshToken.token, cookieOptions);
};

// Middleware for checking if authenticated
// Used to protect routes from unauthorized access
exports.isAuthenticated = passport.authenticate('jwt', { session: false });

// For register API
exports.optionalAuthentication = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) next(err);
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
