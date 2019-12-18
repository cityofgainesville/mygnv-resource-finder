const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

// Path is /api/user/login,
// POST with correct email and password field
// will login and start session
router.route('/login').post(userController.login);

// Path is /api/user/logout
// POST will end session if there in an active session
router.route('/logout').post(userController.logout);

// Path is /api/user/isLoggedIn
// POST will return status: true in JSON if logged in
router.route('/isLoggedIn').post(userController.isLoggedIn);

// Path is /api/user/register
// POST with email and password field
// Will create new user if request is from authenticated user
router
  .route('/register')
  .post(userController.isAuthenticated, userController.register);

module.exports = router;
