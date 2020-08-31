import * as locationController from '../controllers/LocationController';
import * as userController from '../controllers/UserController';
import express from 'express';

export const path = '/api/locations';

const router: express.Router = express.Router();

// Path is /api/locations/list
// GET will return JSON of all locations
// POST will create location if user authenticated
router.get(
  '/list',
  userController.optionalAuthentication,
  locationController.list
);

// Path is /api/locations/create
// POST will create location if user authenticated
router.post(
  '/create',
  userController.isAuthenticated,
  locationController.create
);

// Path is /api/locations/:locationId
// GET will return location
router.get(
  '/:locationId',
  userController.optionalAuthentication,
  locationController.read
);

// Path is /api/locations/update/:locationId
// POST will update location if authenticated
router.post(
  '/update/:locationId',
  userController.isAuthenticated,
  locationController.isLocationUpdateAllowed,
  locationController.update
);

// Path is /api/locations/delete/:locationId
// DELETE will update location if authenticated
router.delete(
  '/delete/:locationId',
  userController.isAuthenticated,
  locationController.remove
);

// Middleware to get location by id from mongoDB
router.param('locationId', locationController.locationById);

export default router;
