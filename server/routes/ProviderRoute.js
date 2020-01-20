const providerController = require('../controllers/ProviderController');
const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

// Path is /api/providers/list
// GET will return JSON of all providers
// POST will create provider if user authenticated
router.route('/list').get(providerController.list);

// Path is /api/providers/create
// POST will create provider if user authenticated
router
  .route('/create')
  .post(userController.isAuthenticated, providerController.create);

// Path is /api/providers/:providerId
// GET will return provider
router.route('/:providerId').get(providerController.read);

// Path is /api/providers/update/:providerId
// POST will update provider if authenticated
router
  .route('/update/:providerId')
  .post(
    userController.isAuthenticated,
    providerController.isProviderUpdateAllowed,
    providerController.update
  );

// Path is /api/providers/delete/:providerId
// DELETE will update provider if authenticated
router
  .route('/delete/:providerId')
  .delete(userController.isAuthenticated, providerController.delete);

// Middleware to get provider by id from mongoDB
router.param('providerId', providerController.providerById);

module.exports = router;
