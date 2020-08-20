const categoryController = require('../controllers/CategoryController');
const userController = require('../controllers/UserController');
const express = require('express');

const path = '/api/categories';

const router = new express.Router();

// Path is /api/categories/list
// GET will return JSON of all categories
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.get(
  '/list',
  userController.optionalAuthentication,
  categoryController.list
);

// Path is /api/categories/create
// POST will create category if user authenticated
router.post(
  '/create',
  userController.isAuthenticated,
  categoryController.create
);

// Path is /api/categories/listTopLevel
// GET will return JSON of all top level categories
/* 
  Accepts query parameters in this format
  children=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.get(
  '/listTopLevel',
  userController.optionalAuthentication,
  categoryController.listTopLevel
);

// Path is /api/categories/:categoryId
// GET will return category
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.get(
  '/:categoryId',
  userController.optionalAuthentication,
  categoryController.read
);

// Path is /api/categories/update/:categoryId
// POST will update category if authenticated
router.post(
  '/update/:categoryId',
  userController.isAuthenticated,
  categoryController.update
);

// Path is /api/categories/delete/:categoryId
// DELETE will delete category if authenticated
router.delete(
  '/delete/:categoryId',
  userController.isAuthenticated,
  categoryController.delete
);

// Middleware that gets category with id == categoryID from mongoDB
router.param('categoryId', categoryController.categoryById);

module.exports = router;
module.exports.path = path;
