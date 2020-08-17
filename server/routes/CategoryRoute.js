const categoryController = require('../controllers/CategoryController');
const userController = require('../controllers/UserController');
const express = require('express');

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
router.route('/list').get(categoryController.list);

// Path is /api/categories/create
// POST will create category if user authenticated
router
  .route('/create')
  .post(userController.isAuthenticated, categoryController.create);

// Path is /api/categories/listTopLevel
// GET will return JSON of all top level categories
/* 
  Accepts query parameters in this format
  children=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.route('/listTopLevel').get(categoryController.listTopLevel);

// Path is /api/categories/:categoryId
// GET will return category
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
router.route('/:categoryId').get(categoryController.read);

// Path is /api/categories/update/:categoryId
// POST will update category if authenticated
router
  .route('/update/:categoryId')
  .post(userController.isAuthenticated, categoryController.update);

// Path is /api/categories/delete/:categoryId
// DELETE will delete category if authenticated
router
  .route('/delete/:categoryId')
  .delete(userController.isAuthenticated, categoryController.delete);

// Middleware that gets category with id == categoryID from mongoDB
router.param('categoryId', categoryController.categoryById);

module.exports = router;
