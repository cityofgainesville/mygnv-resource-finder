const Resource = require('../models/ResourceSchema');
const Category = require('../models/CategorySchema');
const Location = require('../models/LocationSchema');

const { getAddedRemoved } = require('./util');
const roles = require('../models/UserSchema').roles;

// Create a resource
exports.create = (req, res) => {
  // Only the owner role can create new resources.
  if (req.user.role !== roles.OWNER) return res.status(403).end();
  const resource = new Resource(req.body);
  const newLocations = resource.locations;
  const newCategories = resource.categories;
  resource.locations = [];
  resource.categories = [];

  resource.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateResourceLocationsBinding(resource, newLocations);
      updateResourceCategoriesBinding(resource, newCategories);
      category.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, resource: resource });
        }
      });
    }
  });
};

// Get the current resource
exports.read = (req, res) => {
  const resource = req.resource;
  if (req.user?.role !== roles.OWNER) {
    // Do not provide the non-published contact information
    delete resource.maintainer_contact_info;
  }

  res.json(resource);
};

exports.isResourceUpdateAllowed = async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser.role === roles.OWNER) return next();
  const resourceToEdit = req.resource;
  let resources;
  let categories;
  try {
    resources = await Resource.find({});
    categories = await Category.find({});
  } catch (err) {
    console.log(err);
  }
  const allowedResources = [];
  const categoryMap = new Map(
    Object.values(categories).map((category) => [
      category._id.toString(),
      category,
    ])
  );
  const resourceMap = new Map(
    Object.values(resources).map((resource) => [
      resource._id.toString(),
      resource,
    ])
  );
  if (currentUser.role === roles.EDITOR) {
    currentUser.resource_can_edit.forEach((id) => {
      if (!resourceMap.has(id.toString())) return;
      allowedResources.push(resourceMap.get(id.toString()));
    });

    // for each category in cat_can_edit_resource_in, get all resources and stick in array
    currentUser.cat_can_edit_resource_in.forEach((id) => {
      if (!categoryMap.has(id.toString())) return;
      allowedResources.push(
        ...categoryMap
          .get(id.toString())
          .resources.filter((id) => resourceMap.has(id.toString()))
          .map((id) => {
            return resourceMap.get(id.toString());
          })
      );
    });
  }

  if (
    allowedResources.filter(
      (resource) => resource._id.toString() === resourceToEdit._id.toString()
    ).length > 0
  ) {
    return next();
  } else {
    return res.status(403).end();
  }
};

// Update a resource
exports.update = (req, res) => {
  const resource = req.resource;
  const newResource = req.body;

  for (const key in newResource) {
    if (
      Object.prototype.hasOwnProperty.call(newResource, key) &&
      resource[key] !== newResource[key] &&
      key !== 'updated_at' &&
      key !== 'created_at' &&
      key !== '_id' &&
      key !== '__v' &&
      key !== 'locations' &&
      key !== 'categories'
    ) {
      resource[key] = newResource[key];
    }
  }

  resource.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      if (newResource.locations) {
        updateResourceLocationsBinding(resource, newResource.locations);
      }
      if (newResource.categories) {
        updateResourceCategoriesBinding(resource, newResource.categories);
      }

      category.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, resource: resource });
        }
      });
    }
  });
};

const updateResourceLocationsBinding = (resource, newLocations) => {
  // If it's a added location, link the location's binding to this resource.
  // If it's a removed location, unlink the location's binding to this resource.

  if (resource.locations === newLocations) return;

  const { addedLocations, removedLocations } = getAddedRemoved(
    newLocations,
    resource.locations
  );

  addedLocations.map((addedLocation) => {
    Location.findById(addedLocation).exec((err, location) => {
      if (err) {
        res.status(400).send(err);
      } else {
        location.resource = resource._id;
        location.save();
      }
    });
  });

  removedLocations.map((removedLocation) => {
    Location.findById(removedLocation).exec((err, location) => {
      if (err) {
        res.status(400).send(err);
      } else if (location.resource === resource._id) {
        delete location.resource;
        location.save();
      }
    });
  });
  resource.locations = newLocations;
};

const updateResourceCategoriesBinding = (resource, newCategories) => {
  // If it's a added category, link the category's binding to this resource.
  // If it's a removed category, unlink the category's binding to this resource.

  if (resource.categories === newCategories) return;

  const { addedCategories, removedCategories } = getAddedRemoved(
    newCategories,
    resource.categories
  );

  addedCategories.map((addedCategory) => {
    Category.findById(addedCategory).exec((err, category) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const resourcesSet = new Set(category.resources);
        resourcesSet.add(resource._id);
        category.resources = [...resourcesSet];
        category.save();
      }
    });
  });

  removedCategories.map((removedCategory) => {
    Category.findById(removedCategory).exec((err, category) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const resourcesSet = new Set(category.resources);
        if (resourcesSet.has(resource._id)) {
          resourcesSet.delete(resource._id);
          category.resources = [...resourcesSet];
          category.save();
        }
      }
    });
  });

  resource.categories = newCategories;
};

// Delete a resource
// TODO: Properly unlink
exports.delete = (req, res) => {
  if (req.user.role !== roles.OWNER) return res.status(403).end();
  const resource = req.resource;

  // Unlink locations, categories
  Resource.deleteOne(resource, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateResourceLocationsBinding(resource, []);
      updateResourceCategoriesBinding(resource, []);
      res.json({ success: true });
    }
  });
};

// Get all the resources
/* 
  Accepts query parameters in this format
  locations=true // or false
  categories=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
exports.list = (req, res) => {
  let populateOptions = [];
  if (req.query.locations === 'true')
    populateOptions = [...populateOptions, 'locations'];
  if (req.query.categories === 'true')
    populateOptions = [...populateOptions, 'categories'];
  // Ignore private data when populating
  let select = '';
  if (req.user?.role !== roles.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const conditions = req.query.conditions ? req.query.conditions : {};
  Resource.find(conditions)
    .populate(...populateOptions, select)
    .exec((err, resources) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        if (req.user?.role !== roles.OWNER) {
          res.json(
            resources.map((resource) => {
              // Do not provide the non-published contact information
              delete resource.maintainer_contact_info;
              return resource;
            })
          );
        } else res.json(resources);
      }
    });
};

// Middleware to get a resource from database by ID, save in req.resource
exports.resourceById = (req, res, next, id) => {
  Resource.findById(id).exec((err, resource) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.resource = resource;
      req.id = id;
      next();
    }
  });
};
