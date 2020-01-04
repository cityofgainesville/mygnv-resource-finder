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
/* GET Accepts JSON in this format
{
  children: true // or false
  providers: true // or false
}
True will populate the array, false will leave it as an array of ObjectIDs.
*/
// POST will update provider if authenticated
// DELETE will delete provider if authenticated
router
  .route('/:providerId')
  .get(providerController.read)
  .put(userController.isAuthenticated, providerController.update)
  .delete(userController.isAuthenticated, providerController.delete);

// Middleware to get provider by id from mongoDB
router.param('providerId', providerController.providerById);

module.exports = router;
