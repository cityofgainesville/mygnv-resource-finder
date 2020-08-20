const Location = require('../models/LocationSchema');
const Resource = require('../models/ResourceSchema');

const roles = require('../models/UserSchema').roles;

// Create a location
exports.create = (req, res) => {
  if (req.user.role !== roles.OWNER) return res.status(403).end();
  const location = new Location(req.body);
  const newResource = location.resource;
  location.resource = [];

  location.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateLocationResourceBinding(location, newResource);
      location.save((err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json({ success: true, location: location });
        }
      });
    }
  });
};

const updateLocationResourceBinding = (location, newResource) => {
  if (location.resource === newResource) return;

  const oldResource = location.resource;

  if (newResource) {
    Resource.findById(newResource).exec((err, parentResource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const locationsSet = new Set(parentResource.locations);
        locationsSet.add(location._id);
        parentResource.locations = [...locationsSet];
        parentResource.save();
      }
    });
  }

  if (oldResource) {
    Resource.findById(oldResource).exec((err, parentResource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const locationsSet = new Set(parentResource.locations);
        if (locationsSet.has(location._id)) {
          locationsSet.delete(location._id);
          parentResource.locations = [...locationsSet];
          parentResource.save();
        }
      }
    });
  }

  location.resource = newResource;
};

// Get the current location
exports.read = (req, res) => {
  const location = req.location;
  if (req.user?.role !== roles.OWNER) {
    // Do not provide the non-published contact information
    delete location.maintainer_contact_info;
  }

  res.json(location);
};

exports.isLocationUpdateAllowed = async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser.role === 'Owner') return next();
  const locationToEdit = req.location;
  let locations;
  let resources;
  try {
    locations = await Location.find({});
    resources = await resources.find({});
  } catch (err) {
    console.log(err);
  }
  const allowedLocations = [];
  const locationMap = new Map(
    Object.values(locations).map((location) => [
      location._id.toString(),
      location,
    ])
  );
  const resourceMap = new Map(
    Object.values(resources).map((resource) => [
      resource._id.toString(),
      resource,
    ])
  );
  if (currentUser.role === role.EDITOR) {
    currentUser.location_can_edit.forEach((id) => {
      if (!locationMap.has(id.toString())) return;
      allowedLocations.push(locationMap.get(id.toString()));
    });
  }

  // for each resource in resource_can_edit, get all locations and stick in array
  currentUser.resource_can_edit.forEach((id) => {
    if (!resourceMap.has(id.toString())) return;
    allowedLocations.push(
      ...resourceMap
        .get(id.toString())
        .locations.filter((id) => resourceMap.has(id.toString()))
        .map((id) => {
          return resourceMap.get(id.toString());
        })
    );
  });

  if (
    allowedLocations.filter(
      (location) => location._id.toString() === locationToEdit._id.toString()
    ).length > 0
  ) {
    return next();
  } else {
    return res.status(403).end();
  }
};

// Update a location
exports.update = (req, res) => {
  const location = req.location;
  const newLocation = req.body;

  for (const key in newLocation) {
    if (
      Object.prototype.hasOwnProperty.call(newLocation, key) &&
      location[key] !== newLocation[key] &&
      key !== 'updated_at' &&
      key !== 'created_at' &&
      key !== '_id' &&
      key !== '__v' &&
      key !== 'resource'
    ) {
      location[key] = newLocation[key];
    }
  }

  location.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      if (newLocation.resource) {
        updateLocationResourceBinding(location, newLocation.resource);
      }

      category.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, location: location });
        }
      });
    }
  });
};

// Delete a location
exports.delete = (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).end();
  const location = req.location;

  // Unlink resource
  Location.deleteOne(location, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateLocationResourceBinding(location, null);
      res.json({ success: true });
    }
  });
};

// Get all the locations
exports.list = (req, res) => {
  let populateOptions = [];
  if (req.query.resource === 'true')
    populateOptions = [...populateOptions, 'resource'];
  // Ignore private data when populating
  let select = '';
  if (req.user?.role !== roles.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const conditions = req.query.conditions ? req.query.conditions : {};
  Location.find(conditions)
    .populate(...populateOptions, select)
    .exec((err, locations) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        if (req.user?.role !== roles.OWNER) {
          res.json(
            locations.map((locations) => {
              // Do not provide the non-published contact information
              delete locations.maintainer_contact_info;
              return locations;
            })
          );
        } else res.json(locations);
      }
    });
};

// Middleware to get a location from database by ID, save in req.location
exports.locationById = (req, res, next, id) => {
  Location.findById(id).exec((err, location) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.location = location;
      req.id = id;
      next();
    }
  });
};
