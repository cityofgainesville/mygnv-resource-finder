const Category = require('../models/CategorySchema');

// Create a category
exports.create = (req, res) => {
  const category = new Category(req.body);

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(category);
      console.log(category);
    }
  });
};

// Get all the categories
/* 
  Accepts query parameters in this format
  children=true // or false
  providers=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.list = (req, res) => {
  let populateOptions = [];
  if (req.query.children === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.providers === 'true')
    populateOptions = [...populateOptions, 'providers'];
  Category.find({})
    .populate(...populateOptions)
    .exec((err, categories) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(categories);
      }
    });
};

// Get the top level categories
/* 
  Accepts query parameters in this format
  children=true // or false
  providers=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.listTopLevel = (req, res) => {
  let populateOptions = [];
  if (req.query.children === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.providers === 'true')
    populateOptions = [...populateOptions, 'providers'];
  Category.find({ isSubcategory: false })
    .populate(...populateOptions)
    .exec((err, categories) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(categories);
      }
    });
};

// Get the current category
exports.read = (req, res) => {
  res.json(req.category);
};

// Update a category
exports.update = (req, res) => {
  const category = req.category;
  const newCategory = req.body;

  for (const key in newCategory) {
    if (Object.prototype.hasOwnProperty.call(newCategory, key)) {
      category[key] = newCategory[key];
    }
  }

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(category);
      console.log(category);
    }
  });
};

exports.delete = (req, res) => {
  const category = req.category;
  Category.deleteOne(category, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.status(200).end();
  });
};

// Middleware to get a category from database by ID, save in req.category
/* 
  Accepts query parameters in this format
  children=true // or false
  providers=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.categoryById = (req, res, next, id) => {
  let populateOptions = [];
  console.log(req.query);
  if (req.query.children === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.providers === 'true')
    populateOptions = [...populateOptions, 'providers'];
  console.log(populateOptions);
  Category.findById(id)
    .populate(...populateOptions)
    .exec((err, category) => {
      if (err) {
        res.status(400).send(err);
      } else {
        req.category = category;
        req.id = id;
        next();
      }
    });
};
