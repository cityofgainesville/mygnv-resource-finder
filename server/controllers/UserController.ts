import passport from '../config/passport';

import { UserType, UserModel, Role } from '../models/UserModel';
import * as AuthLogic from '../logic/AuthLogic';
import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../config/express';

import dotenv from 'dotenv';
dotenv.config();

const handleErrorMessage = (error: any, res: Response) => {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
    if (error instanceof ResponseError && error.status) {
      res.status(error.status);
    }
  } else {
    message = error;
  }
  res.json({
    success: false,
    error: message,
  });
};

// Register a new user, using email and password fields from body
// If the user registering the new account is not an admin, make the account with no privileges.
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await AuthLogic.register(req.body, req, res);
    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    handleErrorMessage(error, res);
  }
};

// Login a user, get JWT on success
export const login = async (req: Request, res: Response) => {
  try {
    const data = await AuthLogic.login(
      req.body.email,
      req.body.password,
      req,
      res
    );
    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    handleErrorMessage(error, res);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token: string = req.cookies.refreshToken
    ? req.cookies.refreshToken
    : req.body.token;

  try {
    const data = await AuthLogic.refreshToken(token, req, res);
    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    handleErrorMessage(error, res);
  }
};

export const revokeTokens = async (req: Request, res: Response) => {
  try {
    const data = await AuthLogic.revokeTokens(req.userToUpdate.id, req, res);
    res.json({
      success: true,
    });
  } catch (error) {
    handleErrorMessage(error, res);
  }
};

export const revokeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.refreshToken
    ? req.cookies.refreshToken
    : req.body.token;

  try {
    const data = await AuthLogic.revokeToken(token, req, res);
    res.json({
      success: true,
    });
  } catch (error) {
    handleErrorMessage(error, res);
  }
};

// Checks if user is currently logged in, ie. if their token is valid
export const isLoggedIn = (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      success: true,
      user: req.user,
    });
  } else {
    res.json({ success: false, error: 'User is not logged in' });
  }
};

// Update the currently logged in user
export const currentUserUpdate = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const infoToUpdate = req.body;
    if (currentUser.role === Role.OWNER) {
      for (const key in infoToUpdate) {
        if (
          Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
          key !== 'password' &&
          key !== 'old_password' &&
          key !== 'updated_at' &&
          key !== 'created_at' &&
          key !== '_id' &&
          key !== '__v'
        ) {
          currentUser[key] = infoToUpdate[key];
        }
      }
    } else {
      currentUser.first_name = infoToUpdate.first_name;
      currentUser.last_name = infoToUpdate.last_name;
    }
    if (infoToUpdate.password !== undefined && infoToUpdate.password !== '') {
      await currentUser.changePassword(
        infoToUpdate.old_password,
        infoToUpdate.password
      );
    }
    await currentUser.save();
    res.json({ success: true, user: currentUser });
  } catch (error) {
    res.json({
      success: true,
      error: error.message,
    });
  }
};

export const adminUpdate = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const infoToUpdate = req.body;
    const userToUpdate = req.userToUpdate;

    if (!userToUpdate) return res.status(404).end();

    if (currentUser.role !== Role.OWNER) return res.status(401).end();

    for (const key in infoToUpdate) {
      if (
        Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
        key !== 'password' &&
        key !== 'old_password' &&
        key !== 'updated_at' &&
        key !== 'created_at' &&
        key !== '_id' &&
        key !== '__v'
      ) {
        userToUpdate[key] = infoToUpdate[key];
      }
    }
    if (infoToUpdate.password !== undefined && infoToUpdate.password !== '') {
      await userToUpdate.setPassword(infoToUpdate.password);
    }
    await userToUpdate.save();
    res.json({ success: true, user: userToUpdate });
  } catch (error) {
    res.json({
      success: true,
      error: error.message,
    });
  }
};

// Update a user
export const update = async (req: Request, res: Response) => {
  if (req.userToUpdate && req.user.role === Role.OWNER)
    await adminUpdate(req, res);
  else await currentUserUpdate(req, res);
};

// Get all the users
/* 
  Accepts query parameters in this format
  categories=true // or false
  resources=true // or false
  locations=true // or false
  True will populate the array, false will leave it as an array of ObjectIDs.
*/
export const list = (req: Request, res: Response) => {
  if (req.user.role !== Role.OWNER) res.status(401).end();
  let populateOptions = [];
  if ((req.query.categories as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'cat_can_edit_members'];
  if ((req.query.resources as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resource_can_edit'];
  if ((req.query.locations as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'location_can_edit'];

  const filter: any = req.query.filter ? req.query.filter : {};
  UserModel.find(filter)
    .populate(populateOptions)
    .exec((error, users) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.json(users);
      }
    });
};

export const read = (req: Request, res: Response) => {
  if (req.user.role === Role.OWNER) res.json(req.userToUpdate);
  else res.status(401).end();
};

// Delete a user
export const remove = (req: Request, res: Response) => {
  const user = req.userToUpdate;
  UserModel.deleteOne(user, (error) => {
    if (error) {
      res.status(400).send(error);
    } else res.json({ success: true });
  });
};

// Middleware to get a user from database by ID, save in req.userToUpdate
export const userById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  let populateOptions = [];
  if ((req.query.categories as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'cat_can_edit_members'];
  if ((req.query.resources as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'resource_can_edit'];
  if ((req.query.locations as string)?.toLowerCase() === 'true')
    populateOptions = [...populateOptions, 'location_can_edit'];

  UserModel.findById(id)
    .populate(populateOptions)
    .exec((error, user: UserType) => {
      if (error) {
        res.status(400).send(error);
      } else {
        req.userToUpdate = user;
        req.id = id;
        next();
      }
    });
};

// Middleware for checking if authenticated
// Used to protect routes from unauthorized access
export const isAuthenticated = passport.authenticate('jwt', { session: false });

// For optional authorization
export const optionalAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error, user: UserType, info) => {
      if (error) next(error);
      if (user) {
        req.user = user;
      }
      next();
    }
  )(req, res, next);
};
