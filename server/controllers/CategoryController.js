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
exports.list = (req, res) => {
  Category.find({})
    .populate('subcategory_of')
    .exec((err, categories) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(categories);
      }
    });
};

// Get the top level categories
exports.listTopLevel = (req, res) => {
  Category.find({ subcategory_of: { $size: 0 } }).exec((err, categories) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(categories);
    }
  });
};

// Get the subcategories
exports.listSubCategory = (req, res) => {
  Category.find({ 'subcategory_of.0': req.id }).exec((err, categories) => {
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
exports.categoryById = (req, res, next, id) => {
  Category.findById(id)
    .populate('subcategory_of')
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
