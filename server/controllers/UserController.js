const passport = require('../config/passport');
const User = require('../models/UserSchema');

// Register a new user, using email and password fields from body
exports.register = (req, res) => {
  const password =
    req.body.password && req.body.password !== ''
      ? req.body.password
      : 'Password1';
  User.register(new User(req.body), password, (err, user) => {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    } else {
      res.json({ success: true, message: 'Registration successful' });
    }
  });
};

// Checks if user is currently logged in, ie. if they have a session started
exports.isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      message: 'User is logged in',
      user: req.user,
    });
  } else {
    res.json({ success: false, message: 'User is not logged in' });
  }
};

// Login a user, makes a session on success
exports.login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.json({ success: false, message: `Login Error: ${err} ` });
    }
    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid username or password',
      });
    } else {
      req.login(user, (err) => {
        if (err) {
          return res.json({ success: false, message: `Login Error: ${err} ` });
        }
        res.json({
          success: true,
          message: 'Authentication successful',
          user: req.user,
        });
      });
    }
  })(req, res);
};

// Logout a user, ending session
exports.logout = (req, res) => {
  req.logout();
  res.json({ success: true, message: 'Logout successful' });
};

// Update the currently logged in user
const currentUserUpdate = async (req, res) => {
  try {
    const currentUser = req.user;
    const infoToUpdate = req.body;
    if (currentUser.role === 'Provider' || currentUser.role === 'Editor') {
      if (currentUser.assigned_provider !== infoToUpdate.assigned_provider) {
        currentUser.assigned_provider = infoToUpdate.assigned_provider;
        currentUser.can_edit_assigned_provider = false;
      }
    } else if (currentUser.role === 'Owner') {
      for (const key in infoToUpdate) {
        if (
          Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
          key !== 'password' &&
          key !== 'old_password' &&
          currentUser[key] !== infoToUpdate[key]
        ) {
          currentUser[key] = infoToUpdate[key];
        }
      }
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

    if (currentUser.role !== 'Owner') return res.status(403).end();

    for (const key in infoToUpdate) {
      if (
        Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
        key !== 'password' &&
        key !== 'old_password' &&
        userToUpdate[key] !== infoToUpdate[key]
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
  if (req.userToUpdate && req.user.role === 'Owner')
    await adminUpdate(req, res);
  else await currentUserUpdate(req, res);
};

// Get all the users
/* 
  Accepts query parameters in this format
  categories=true // or false
  providers=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.list = (req, res) => {
  if (req.user.role !== 'Owner') res.status(403).end();
  let populateOptions = [];
  if (req.query.categories === 'true')
    populateOptions = [...populateOptions, 'cat_can_edit_provider_in'];
  if (req.query.providers === 'true')
    populateOptions = [...populateOptions, 'provider_can_edit'];
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
  if (req.user.role === 'Owner') res.json(req.userToUpdate);
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

// Middleware for checking if authenticated
// Used to protect routes from unauthorized access
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).end();
};
