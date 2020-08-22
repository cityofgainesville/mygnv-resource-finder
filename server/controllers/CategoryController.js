import Category from '../models/CategorySchema';
import Resource from '../models/ResourceSchema';

import { getAddedRemoved } from './util';
import { roles } from '../models/UserSchema';

// Get all the categories
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/

const exports = {};

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
  const conditions = req.query.conditions ? req.query.conditions : {};
  Category.find(conditions)
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
  const newResources = category.resources;
  const newChildren = category.children;
  const newParents = category.parents;
  category.resources = [];
  category.children = [];
  category.parents = [];

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateCategoryResourcesBinding(category, newResources);
      updateCategoryChildrenBinding(category, newChildren);
      updateCategoryParentsBinding(category, newParents);
      category.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, category: category });
        }
      });
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
  if (newCategory.icon_name) {
    category.icon_name = newCategory.icon_name;
  }

  category.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      if (newCategory.resources) {
        updateCategoryResourcesBinding(category, newCategory.resources);
      }
      if (newCategory.children) {
        updateCategoryChildrenBinding(category, newCategory.children);
      }
      if (newCategory.parents) {
        updateCategoryParentsBinding(category, category.parents);
      }

      category.save((err) => {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.json({ success: true, category: category });
        }
      });
    }
  });
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
        resource.save();
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
          resource.save();
        }
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
        childCategory.save();
      }
    });
  });

  removedChildren.map((removedChild) => {
    Category.findById(removedChild).exec((err, childCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const parentsSet = new Set(childCategory.parents);
        if (parentsSet.has(category._id)) {
          parentsSet.delete(category._id);
          childCategory.parents = [...parentsSet];
          childCategory.save();
        }
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
        parentCategory.parents = [...childrenSet];
        parentCategory.save();
      }
    });
  });

  removedParents.map((removedParent) => {
    Category.findById(removedParent).exec((err, parentCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const childrenSet = new Set(parentCategory.children);
        if (childrenSet.has(category._id)) {
          childrenSet.delete(category._id);
          parentCategory.children = [...childrenSet];
          parentCategory.save();
        }
      }
    });
  });

  category.parents = newParents;
};

exports.delete = (req, res) => {
  if (req.user?.role !== roles.OWNER) return res.status(403).end();
  const category = req.category;

  // Unlink resources, children, parents
  Category.deleteOne(category, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateCategoryResourcesBinding(category, []);
      updateCategoryChildrenBinding(category, []);
      updateCategoryParentsBinding(category, []);
      res.json({ success: true });
    }
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
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== roles.OWNER) {
    select = '-_maintainer_contact_info';
  }
  Category.findById(id)
    // Ignore private data when populating
    .populate(...populateOptions, select)
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

export default exports;
