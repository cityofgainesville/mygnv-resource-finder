const passport = require('../config/passport');
const User = require('../models/UserSchema');

// Register a new user, using email and password fields from body
exports.register = (req, res) => {
  User.register(
    new User({ email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        });
      } else {
        res.json({ success: true, message: 'Registration successful' });
      }
    },
  );
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
          email: req.user.email,
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

// Checks if user is currently logged in, ie. if they have a session started
exports.isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      message: 'User is logged in',
      email: req.user.email,
    });
  } else {
    res.json({ success: false, message: 'User is not logged in' });
  }
};

// Middleware for checking if authenticated
// Used to protect routes from unauthorized access
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
