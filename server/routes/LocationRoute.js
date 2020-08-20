const locationController = require('../controllers/LocationController');
const userController = require('../controllers/UserController');
const express = require('express');
const router = new express.Router();

const path = '/api/resources';

module.exports = router;
module.exports.path = path;
