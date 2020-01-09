const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

// Path is /api/users/login,
// POST with correct email and password field
// will login and start session
router.route('/login').post(userController.login);

// Path is /api/users/logout
// POST will end session if there in an active session
router.route('/logout').post(userController.logout);

// Path is /api/users/isLoggedIn
// POST will return status: true in JSON if logged in
router.route('/isLoggedIn').post(userController.isLoggedIn);

// Path is /api/users/list
// GET to list users
// Only user with role === 'Owner' can do this
router.route('/list').get(userController.isAuthenticated, userController.list);

// Path is /api/users/:userId
// GET to read user by id
router
  .route('/:userId')
  .get(userController.isAuthenticated, userController.read);

// Path is /api/users/register
// POST
// Will create new user if request is from authenticated user
router
  .route('/register')
  .post(userController.isAuthenticated, userController.register);

// Path is /api/users/update/:userId
// POST
// Complete user editing control if res.user.role === 'Owner'
// If no userId passed in then logged in user is updated
router
  .route('/update/:userId?')
  .post(userController.isAuthenticated, userController.update);

// Path is /api/users/delete/:userId
// DELETE to delete user by id
router
  .route('/delete/:userId')
  .delete(userController.isAuthenticated, userController.delete);

// Middleware to get user by id from mongoDB
router.param('userId', userController.userById);

module.exports = router;
