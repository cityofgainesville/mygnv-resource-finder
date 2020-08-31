import { ResourceType, Resource, ResourceModel } from '../models/ResourceModel';

import { CategoryType, Category, CategoryModel } from '../models/CategoryModel';

import { ObjectId, getAddedRemoved } from './util';
import { Role } from '../models/UserModel';
import { QueryPopulateOptions, MongooseFilterQuery } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Get all the categories
/* 
  Accepts query parameters in this format
  children=true // or false
  parents=true // or false
  resources=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/

export const list = (req: Request, res: Response) => {
  let populateOptions = [];
  if ((req.query.children as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if ((req.query.parents as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'parents'];
  if ((req.query.resources as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
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
  CategoryModel.find(filter)
    .populate(queryPopulateOptions)
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
export const listTopLevel = (req: Request, res: Response) => {
  let populateOptions = [];
  if ((req.query.children as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if ((req.query.parents as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'parents'];
  if ((req.query.resources as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== Role.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const queryPopulateOptions = populateOptions.map((path) => {
    const option: QueryPopulateOptions = { path, select };
    return option;
  });

  CategoryModel.find({ parents: { $size: 0 } })
    .populate(queryPopulateOptions)
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
export const read = (req: Request, res: Response) => {
  res.json(req.category);
};

// Create a category
export const create = (req: Request, res: Response) => {
  if (req.user?.role !== Role.OWNER) return res.status(403).end();
  const category: CategoryType = new CategoryModel(req.body);
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
      updateCategoryResourcesBinding(res, category, newResources as ObjectId[]);
      updateCategoryChildrenBinding(res, category, newChildren as ObjectId[]);
      updateCategoryParentsBinding(res, category, newParents as ObjectId[]);
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
export const update = (req: Request, res: Response) => {
  if (req.user?.role !== Role.OWNER) return res.status(403).end();
  const category = req.category;
  const newCategory = new CategoryModel(req.body);

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
        updateCategoryResourcesBinding(
          res,
          category,
          newCategory.resources as ObjectId[]
        );
      }
      if (newCategory.children) {
        updateCategoryChildrenBinding(
          res,
          category,
          newCategory.children as ObjectId[]
        );
      }
      if (newCategory.parents) {
        updateCategoryParentsBinding(
          res,
          category,
          newCategory.parents as ObjectId[]
        );
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

const updateCategoryResourcesBinding = (
  res: Response,
  category: CategoryType,
  newResources: ObjectId[]
) => {
  // If it's a added resource, link the resource's binding to this category.
  // If it's a removed resource, unlink the resource's binding to this category.

  if (category.resources === newResources) return;

  const { added: addedResources, removed: removedResources } = getAddedRemoved(
    newResources,
    category.resources as ObjectId[]
  );

  addedResources.map((addedResource) => {
    ResourceModel.findById(addedResource).exec(async (err, resource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const categoriesSet = new Set(resource.categories);
        categoriesSet.add(category.id);
        resource.categories = [...categoriesSet];
        await resource.save();
      }
    });
  });

  removedResources.map((removedResource) => {
    ResourceModel.findById(removedResource).exec(async (err, resource) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const categoriesSet = new Set(resource.categories);
        if (categoriesSet.has(category.id)) {
          categoriesSet.delete(category.id);
          resource.categories = [...categoriesSet];
          await resource.save();
        }
      }
    });
  });

  category.resources = newResources;
};

const updateCategoryChildrenBinding = (
  res: Response,
  category: CategoryType,
  newChildren: ObjectId[]
) => {
  if (category.children === newChildren) return;

  // If it's a added child, link the child's binding to this category.
  // If it's a removed child, unlink the child's binding to this category.
  const { added: addedChildren, removed: removedChildren } = getAddedRemoved(
    newChildren,
    category.children as ObjectId[]
  );

  addedChildren.map((addedChild) => {
    CategoryModel.findById(addedChild).exec(async (err, childCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const parentsSet = new Set(childCategory.parents);
        parentsSet.add(category.id);
        childCategory.parents = [...parentsSet];
        await childCategory.save();
      }
    });
  });

  removedChildren.map((removedChild) => {
    CategoryModel.findById(removedChild).exec(async (err, childCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const parentsSet = new Set(childCategory.parents);
        if (parentsSet.has(category.id)) {
          parentsSet.delete(category.id);
          childCategory.parents = [...parentsSet];
          await childCategory.save();
        }
      }
    });
  });

  category.children = newChildren;
};

const updateCategoryParentsBinding = (
  res: Response,
  category: CategoryType,
  newParents: ObjectId[]
) => {
  if (category.parents === newParents) return;

  // If it's a added child, link the child's binding to this category.
  // If it's a removed child, unlink the child's binding to this category.
  const { added: addedParents, removed: removedParents } = getAddedRemoved(
    newParents,
    category.parents as ObjectId[]
  );

  addedParents.map((addedParent) => {
    CategoryModel.findById(addedParent).exec(async (err, parentCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const childrenSet = new Set(parentCategory.parents);
        childrenSet.add(category.id);
        parentCategory.parents = [...childrenSet];
        await parentCategory.save();
      }
    });
  });

  removedParents.map((removedParent) => {
    CategoryModel.findById(removedParent).exec(async (err, parentCategory) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const childrenSet = new Set(parentCategory.children);
        if (childrenSet.has(category.id)) {
          childrenSet.delete(category.id);
          parentCategory.children = [...childrenSet];
          await parentCategory.save();
        }
      }
    });
  });

  category.parents = newParents;
};

export const remove = (req: Request, res: Response) => {
  if (req.user?.role !== Role.OWNER) return res.status(403).end();
  const category = req.category;

  // Unlink resources, children, parents
  CategoryModel.deleteOne(category, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      updateCategoryResourcesBinding(res, category, []);
      updateCategoryChildrenBinding(res, category, []);
      updateCategoryParentsBinding(res, category, []);
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

export const categoryById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  let populateOptions = [];
  if ((req.query.children as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'children'];
  if ((req.query.parents as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'parents'];
  if ((req.query.resources as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resources'];
  let select = '';
  // Ignore private data when populating
  if (req.user?.role !== Role.OWNER) {
    select = '-_maintainer_contact_info';
  }
  const queryPopulateOptions = populateOptions.map((path) => {
    const option: QueryPopulateOptions = { path, select };
    return option;
  });

  CategoryModel.findById(id)
    // Ignore private data when populating
    .populate(queryPopulateOptions)
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
