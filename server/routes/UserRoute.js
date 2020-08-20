const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

const path = '/api/users';

// Path is /api/users/login
// POST with correct email and password field
// will login and start session
router.post('/login', userController.login);

// Path is /api/users/register
// POST
// Will create new user if current user has role === 'Owner'
router.post(
  '/register',
  userController.optionalAuthentication,
  userController.register
);

// Path is /api/users/isLoggedIn
// POST will return status: true in JSON if logged in
router.post(
  '/isLoggedIn',
  userController.optionalAuthentication,
  userController.isLoggedIn
);

router.post('/refresh-token', userController.refreshToken);

router.post(
  '/revoke-token',
  userController.isAuthenticated,
  userController.revokeToken
);

// Path is /api/users/list
// GET to list users
// Only user with role === 'Owner' can do this
/* 
  Accepts query parameters in this format
  categories=true // or false
  resources=true // or false
  locations=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.get('/list', userController.isAuthenticated, userController.list);

// Path is /api/users/:userId
// GET to read user by id
router.get('/:userId', userController.isAuthenticated, userController.read);

// Path is /api/users/update/:userId
// POST
// Complete user editing control if current user has role === 'Owner'
// If no userId passed in then logged in user is updated
router.post(
  '/update/:userId',
  userController.isAuthenticated,
  userController.update
);

// Path is /api/users/delete/:userId
// DELETE to delete user by id
router.delete(
  '/delete/:userId',
  userController.isAuthenticated,
  userController.delete
);

// Middleware to get user by id from mongoDB
router.param('userId', userController.userById);

module.exports = router;
module.exports.path = path;
