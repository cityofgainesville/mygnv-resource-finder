const categoryController = require('../controllers/CategoryController');
const userController = require('../controllers/UserController');
const express = require('express');

const router = new express.Router();

// Path is /api/category
// GET will return JSON of all categories
// POST will create category if user authenticated
router
  .route('/')
  .get(categoryController.list)
  .post(userController.isAuthenticated, categoryController.create);

// Path is /api/category/topLevelCategory
// GET will return JSON of all top level categories
router.route('/topLevelCategory').get(categoryController.listTopLevel);

// Path is /api/category/subCategory/:categoryId
// GET will return list of subCategories under parent category's id
router
  .route('/subCategory/:categoryId')
  .get(categoryController.listSubCategory);

// Path is /api/category/:categoryId
// GET will return category
// POST will update category if authenticated
// DELETE will delete category if authenticated
router
  .route('/:categoryId')
  .get(categoryController.read)
  .post(userController.isAuthenticated, categoryController.update)
  .delete(userController.isAuthenticated, categoryController.delete);

// Middleware that gets category with id == categoryID from mongoDB
router.param('categoryId', categoryController.categoryById);

module.exports = router;
