import { ResourceModel, ResourceType } from '../models/ResourceModel';
import { CategoryModel, CategoryType } from '../models/CategoryModel';
import { LocationModel } from '../models/LocationModel';
import { Request, Response, NextFunction } from 'express';

import { getAddedRemoved, ObjectId } from './util';
import { Role } from '../models/UserModel';

// Create a resource
export const create = (req: Request, res: Response) => {
  // Only the owner role can create new resources.
  if (req.user.role !== Role.OWNER) return res.status(403).end();
  const resource = new ResourceModel(req.body);
  const newLocations = resource.locations;
  const newCategories = resource.categories;
  resource.locations = [];
  resource.categories = [];

  resource.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateResourceLocationsBinding(res, resource, newLocations as ObjectId[]);
      updateResourceCategoriesBinding(
        res,
        resource,
        newCategories as ObjectId[]
      );
      resource.save((err: any) => {
        if (err) {
        } else {
          res.json({ success: true, resource: resource });
        }
      });
    }
  });
};

// Get the current resource
export const read = (req: Request, res: Response) => {
  const resource = req.resource;
  if (req.user?.role !== Role.OWNER) {
    // Do not provide the non-published contact information
    delete resource.maintainer_contact_info;
  }

  res.json(resource);
};

export const isResourceUpdateAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;
  if (currentUser.role === Role.OWNER) return next();
  const resourceToEdit = req.resource;
  let resources: ResourceType[];
  let categories: CategoryType[];
  try {
    resources = await ResourceModel.find({});
    categories = await CategoryModel.find({});
  } catch (err) {
    console.log(err);
  }
  const allowedResources: ResourceType[] = [];
  const categoryMap = new Map(
    Object.values(categories).map((category) => [
      category._id as ObjectId,
      category,
    ])
  );
  const resourceMap = new Map(
    Object.values(resources).map((resource) => [
      resource._id as ObjectId,
      resource,
    ])
  );
  if (currentUser.role === Role.EDITOR) {
    currentUser.resource_can_edit.forEach((id: ObjectId) => {
      if (!resourceMap.has(id)) return;
      allowedResources.push(resourceMap.get(id));
    });

    // for each category in cat_can_edit_resource_in, get all resources and stick in array
    currentUser.cat_can_edit_members.forEach((id: ObjectId) => {
      if (!categoryMap.has(id)) return;
      allowedResources.push(
        ...categoryMap
          .get(id)
          .resources.filter((id: ObjectId) => resourceMap.has(id))
          .map((id: ObjectId) => {
            return resourceMap.get(id);
          })
      );
    });
  }

  if (
    allowedResources.filter((resource) => resource._id === resourceToEdit._id)
      .length > 0
  ) {
    return next();
  } else {
    return res.status(403).end();
  }
};

// Update a resource
export const update = (req: Request, res: Response) => {
  const resource = req.resource;
  const newResource = new ResourceModel(req.body);

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
        updateResourceLocationsBinding(
          res,
          resource,
          newResource.locations as ObjectId[]
        );
      }
      if (newResource.categories) {
        updateResourceCategoriesBinding(
          res,
          resource,
          newResource.categories as ObjectId[]
        );
      }

      resource.save((err) => {
        if (err) {
        } else {
          res.json({ success: true, resource: resource });
        }
      });
    }
  });
};

const updateResourceLocationsBinding = (
  res: Response,
  resource: ResourceType,
  newLocations: ObjectId[]
) => {
  // If it's a added location, link the location's binding to this resource.
  // If it's a removed location, unlink the location's binding to this resource.

  if (resource.locations === newLocations) return;

  const { added: addedLocations, removed: removedLocations } = getAddedRemoved(
    newLocations,
    resource.locations as ObjectId[]
  );

  addedLocations.map((addedLocation) => {
    LocationModel.findById(addedLocation).exec((err, location) => {
      if (err) {
        res.status(400).send(err);
      } else {
        location.resource = resource._id;
        location.save();
      }
    });
  });

  removedLocations.map((removedLocation) => {
    LocationModel.findById(removedLocation).exec((err, location) => {
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

const updateResourceCategoriesBinding = (
  res: Response,
  resource: ResourceType,
  newCategories: ObjectId[]
) => {
  // If it's a added category, link the category's binding to this resource.
  // If it's a removed category, unlink the category's binding to this resource.

  if (resource.categories === newCategories) return;

  const {
    added: addedCategories,
    removed: removedCategories,
  } = getAddedRemoved(newCategories, resource.categories as ObjectId[]);

  addedCategories.map((addedCategory) => {
    CategoryModel.findById(addedCategory).exec((err, category) => {
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
    CategoryModel.findById(removedCategory).exec((err, category) => {
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
export const remove = (req: Request, res: Response) => {
  if (req.user.role !== Role.OWNER) return res.status(403).end();
  const resource = req.resource;

  // Unlink locations, categories
  ResourceModel.deleteOne(resource, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateResourceLocationsBinding(res, resource, []);
      updateResourceCategoriesBinding(res, resource, []);
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
export const list = (req: Request, res: Response) => {
  let populateOptions = [];
  if (req.query.locations === 'true')
    populateOptions = [...populateOptions, 'locations'];
  if (req.query.categories === 'true')
    populateOptions = [...populateOptions, 'categories'];
  // Ignore private data when populating
  let select = '';
  if (req.user?.role !== Role.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const filter: any = req.query.filter ? req.query.filter : {};
  ResourceModel.find(filter)
    .populate(populateOptions, select)
    .exec((err, resources) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        if (req.user?.role !== Role.OWNER) {
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
export const resourceById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  ResourceModel.findById(id).exec((err, resource) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.resource = resource;
      req.id = id;
      next();
    }
  });
};
