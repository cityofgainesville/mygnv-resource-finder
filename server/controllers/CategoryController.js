const Category = require('../models/CategorySchema');
const Resource = require('../models/ResourceSchema');

const roles = require('../config/roles');

// Get all the categories
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.list = (req, res) => {
  let populateOptions = [];
  if (req.query.children?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.parents?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'parents'];
  if (req.query.resources?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== roles.OWNER) {
    select = '-_maintainer_contact_info';
  }
  Category.find({})
    .populate(...populateOptions, select)
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
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.listTopLevel = (req, res) => {
  let populateOptions = [];
  if (req.query.children?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.resources?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== roles.OWNER) {
    select = '-_maintainer_contact_info';
  }
  Category.find({ parents: { $size: 0 } })
    .populate(...populateOptions, select)
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

// Create a category
exports.create = (req, res) => {
  if (req.user?.role !== roles.OWNER) return res.status(403).end();
  const category = new Category(req.body);

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, category: category });
    }
  });
};

// Update a category
exports.update = (req, res) => {
  if (req.user?.role !== roles.OWNER) return res.status(403).end();
  const category = req.category;
  const newCategory = req.body;

  if (newCategory.name) {
    category.name = newCategory.name;
  }

  updateCategoryResourcesBinding(category, newCategory.resources);

  updateCategoryChildrenBinding(children, newCategory.children);

  updateCategoryParentsBinding(children, newCategory.parents);

  if (newCategory.icon_name) {
    category.icon_name = newCategory.icon_name;
  }

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, category: category });
    }
  });
};

const getAddedRemoved = (newValues, oldValues) => {
  const newValuesSet = new Set(newValues);
  const oldValuesSet = new Set(oldValues);
  const addedValues = [];
  const removedValues = [];
  newValues.forEach((value) => {
    if (!oldValuesSet.has(value)) {
      addedValues.push(value);
    }
  });
  oldValues.forEach((value) => {
    if (!newValuesSet.has(value)) {
      removedValues.push(value);
    }
  });
  return { addedValues, removedValues };
};

const updateCategoryResourcesBinding = (category, newResources) => {
  // If it's a added resource, link the resource's binding to this category.
  // If it's a removed resource, unlink the resource's binding to this category.

  if (category.resources === newResources) return;

  const { addedResources, removedResources } = getAddedRemoved(
    newResources,
    category.resources
  );

  addedResources.map((addedResource) => {
    Resource.findById(addedResource).exec((err, resource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const categoriesSet = new Set(resource.categories);
        categoriesSet.add(category._id);
        resource.categories = [...categoriesSet];
      }
    });
  });

  removedResources.map((removedResource) => {
    Resource.findById(removedResource).exec((err, resource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const categoriesSet = new Set(resource.categories);
        if (categoriesSet.has(category._id)) {
          categoriesSet.delete(category._id);
          resource.categories = [...categoriesSet];
        }
        resource.save();
      }
    });
  });

  category.resources = newResources;
};

const updateCategoryChildrenBinding = (category, newChildren) => {
  if (category.children === newChildren) return;

  // If it's a added child, link the child's binding to this category.
  // If it's a removed child, unlink the child's binding to this category.
  const { addedChildren, removedChildren } = getAddedRemoved(
    newChildren,
    category.children
  );

  addedChildren.map((addedChild) => {
    Category.findById(addedChild).exec((err, childCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const parentsSet = new Set(childCategory.parents);
        parentsSet.add(category._id);
        childCategory.parents = [...parentsSet];
      }
      childCategory.save();
    });
  });

  removedChildren.map((removedChild) => {
    Category.findById(removedChild).exec((err, childCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if (parentsSet.has(category._id)) {
          const parentsSet = new Set(childCategory.parents);
          parentsSet.delete(category._id);
          childCategory.parents = [...parentsSet];
        }
        childCategory.save();
      }
    });
  });

  category.children = newChildren;
};

const updateCategoryParentsBinding = (category, newParents) => {
  if (category.parents === newParents) return;

  // If it's a added child, link the child's binding to this category.
  // If it's a removed child, unlink the child's binding to this category.
  const { addedParents, removedParents } = getAddedRemoved(
    newParents,
    category.parents
  );

  addedParents.map((addedParent) => {
    Category.findById(addedParent).exec((err, parentCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const childrenSet = new Set(parentCategory.parents);
        childrenSet.add(category._id);
        parentCategory.children = [...childrenSet];
      }
      parentCategory.save();
    });
  });

  removedParents.map((removedParent) => {
    Category.findById(removedParent).exec((err, parentCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if (childrenSet.has(category._id)) {
          const childrenSet = new Set(parentCategory.children);
          childrenSet.delete(category._id);
          parentCategory.children = [...childrenSet];
        }
        parentCategory.save();
      }
    });
  });

  category.parents = newParents;
};

exports.delete = (req, res) => {
  if (req.user?.role !== roles.OWNER) return res.status(403).end();
  const category = req.category;
  Category.deleteOne(category, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.json({ success: true });
  });
};

// Middleware to get a category from database by ID, save in req.category
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/

exports.categoryById = (req, res, next, id) => {
  let populateOptions = [];
  console.log(req.query);
  if (req.query.children?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if (req.query.parents?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'parents'];
  if (req.query.resources?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
  console.log(populateOptions);
  Category.findById(id)
    // Ignore private data when populating
    .populate(...populateOptions, '-_maintainer_contact_info')
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
