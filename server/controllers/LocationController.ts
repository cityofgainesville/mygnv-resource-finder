import { LocationModel, LocationType } from '../models/LocationModel';
import { ResourceModel, ResourceType } from '../models/ResourceModel';
import { Request, Response, NextFunction } from 'express';
import { Role } from '../models/UserModel';
import { QueryPopulateOptions } from 'mongoose';
import { ObjectId } from './util';

// Create a location
export const create = (req: Request, res: Response) => {
  if (req.user.role !== Role.OWNER) return res.status(403).end();
  const location = new LocationModel(req.body);
  const newResource = location.resource;
  location.resource = null;

  location.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateLocationResourceBinding(res, location, newResource as ObjectId);
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

const updateLocationResourceBinding = (
  res: Response,
  location: LocationType,
  newResource: ObjectId
) => {
  if (location.resource === newResource) return;

  const oldResource = location.resource;

  if (newResource) {
    ResourceModel.findById(newResource).exec((err, parentResource) => {
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
    ResourceModel.findById(oldResource).exec((err, parentResource) => {
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
export const read = (req: Request, res: Response) => {
  const location = req.location;
  if (req.user?.role !== Role.OWNER) {
    // Do not provide the non-published contact information
    delete location.maintainer_contact_info;
  }

  res.json(location);
};

export const isLocationUpdateAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;
  if (currentUser.role === Role.OWNER) return next();
  const locationToEdit = req.location;
  let locations: LocationType[];
  let resources: ResourceType[];
  try {
    locations = await LocationModel.find({});
    resources = await ResourceModel.find({});
  } catch (err) {
    console.log(err);
  }
  const allowedLocations: LocationType[] = [];
  const locationMap = new Map(
    Object.values(locations).map((location) => [
      location._id as ObjectId,
      location,
    ])
  );
  const resourceMap = new Map(
    Object.values(resources).map((resource) => [
      resource._id as ObjectId,
      resource,
    ])
  );
  if (currentUser.role === Role.EDITOR) {
    currentUser.location_can_edit.forEach((id: ObjectId) => {
      if (!locationMap.has(id)) return;
      allowedLocations.push(locationMap.get(id));
    });
  }

  // for each resource in resource_can_edit, get all locations and stick in array
  currentUser.resource_can_edit.forEach((id: ObjectId) => {
    if (!resourceMap.has(id)) return;
    allowedLocations.push(
      ...resourceMap
        .get(id)
        .locations.filter((id: ObjectId) => locationMap.has(id))
        .map((id: ObjectId) => {
          return locationMap.get(id);
        })
    );
  });

  if (
    allowedLocations.filter((location) => location._id === locationToEdit._id)
      .length > 0
  ) {
    return next();
  } else {
    return res.status(403).end();
  }
};

// Update a location
export const update = (req: Request, res: Response) => {
  const location = req.location;
  const newLocation = new LocationModel(req.body);

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
        updateLocationResourceBinding(
          res,
          location,
          newLocation.resource as ObjectId
        );
      }
      location.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, location: location });
        }
      });
    }
  });
};

// Delete a location
export const remove = (req: Request, res: Response) => {
  if (req.user.role !== Role.OWNER) return res.status(403).end();
  const location = req.location;

  // Unlink resource
  LocationModel.deleteOne(location, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateLocationResourceBinding(res, location, null);
      res.json({ success: true });
    }
  });
};

// Get all the locations
export const list = (req: Request, res: Response) => {
  let populateOptions = [];
  if ((req.query.resource as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resource'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== Role.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const queryPopulateOptions = populateOptions.map((path) => {
    const option: QueryPopulateOptions = { path, select };
    return option;
  });

  const filter: any = req.query.filter ? req.query.filter : {};

  LocationModel.find(filter)
    .populate(populateOptions, select)
    .exec((err, locations) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        if (req.user?.role !== Role.OWNER) {
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
export const locationById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  let populateOptions = [];
  if ((req.query.resource as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resource'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== Role.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const queryPopulateOptions = populateOptions.map((path) => {
    const option: QueryPopulateOptions = { path, select };
    return option;
  });

  LocationModel.findById(id).exec((err, location) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.location = location;
      req.id = id;
      next();
    }
  });
};
