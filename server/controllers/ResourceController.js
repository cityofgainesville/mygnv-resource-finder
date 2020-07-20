const Resource = require('../models/ResourceSchema');
const Category = require('../models/CategorySchema');

// Create a resource
exports.create = (req, res) => {
  // Only the owner role can create new resources.
  if (req.user.role !== 'Owner') return res.status(403).end();
  const resource = new Resource(req.body);

  resource.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, resource: resource });
    }
  });
};

// Get the current resource
exports.read = (req, res) => {
  const resource = req.resource;
  // Do not provide the non-published contact information
  delete resource.maintainer_contact_info;
  res.json(resource);
};

exports.isResourceUpdateAllowed = async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser.role === 'Owner') return next();
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
  if (currentUser.role === 'Editor') {
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
  const infoToUpdate = req.body;

  for (const key in infoToUpdate) {
    if (
      Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
      resource[key] !== infoToUpdate[key] &&
      key !== 'updated_at' &&
      key !== 'created_at' &&
      key !== '_id' &&
      key !== '__v'
    ) {
      resource[key] = infoToUpdate[key];
    }
  }

  resource.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, resource: resource });
    }
  });
};

// Delete a resource
// TODO: Properly unlink
exports.delete = (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).end();
  const resource = req.resource;
  Resource.deleteOne(resource, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.json({ success: true });
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
  Resource.find({})
    .populate(...populateOptions)
    .exec((err, resources) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(
          resources.map((resource) => {
            if (
              resource.locations &&
              resource.locations.length &&
              resource.locations[0] instanceof mongoose.Types.ObjectId
            ) {
              resource.locations = resource.locations.map((location) => {
                // Do not provide the non-published contact information
                delete location.maintainer_contact_info;
                return location;
              });
            }
            // Do not provide the non-published contact information
            delete resource.maintainer_contact_info;
            return resource;
          })
        );
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
