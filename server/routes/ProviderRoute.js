const providerController = require('../controllers/ProviderController');
const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

// Path is /api/provider
// GET will return JSON of all providers
// POST will create provider if user authenticated
router
  .route('/')
  .get(providerController.list)
  .post(userController.isAuthenticated, providerController.create);

// Path is /api/provider/:providerId
// GET will return provider
// POST will update provider if authenticated
// DELETE will delete provider if authenticated
router
  .route('/:providerId')
  .get(providerController.read)
  .put(userController.isAuthenticated, providerController.update)
  .delete(userController.isAuthenticated, providerController.delete);

// Path is /api/provider/subCategory/:categoryId
// GET will return list of providers under subcategory id.
router
  .route('/subCategory/:categoryId')
  .get(providerController.listSubCategory);

// Middleware to get provider by id from mongoDB
router.param('providerId', providerController.providerById);
// Middleware to get list of providers in subcategory from mongoDB
// by category id
router.param('categoryId', providerController.getSubCategory);

module.exports = router;
