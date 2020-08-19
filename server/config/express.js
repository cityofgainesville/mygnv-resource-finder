const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('./passport');

const categoryRouter = require('../routes/CategoryRoute');
const locationRouter = require('../routes/LocationRoute');
const resourceRouter = require('../routes/ResourceRoute');
const userRouter = require('../routes/UserRoute');

const {
  resourcesURI,
  locationsURI,
  categoriesURI,
  usersURI,
} = require('./paths');

const developmentMode = 'development';
const devServerEnabled =
  process.argv.length >= 2 && process.argv[2] === developmentMode;

// Populate process.env, for development
require('dotenv').config();

const dbUri = process.env.DB_URI ? process.env.DB_URI : '';
const port = process.env.PORT ? process.env.PORT : 8080;

module.exports.start = () => {
  // Connect to database
  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  const app = express();

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // Parse application/json
  app.use(bodyParser.json());

  // A day in milliseconds
  const DAY_IN_MS = 24 * 3600000;

  app.use(passport.initialize());

  // Routes
  app.use(resourcesURI.path, resourceRouter);
  app.use(locationsURI.path, locationRouter);
  app.use(categoriesURI.path, categoryRouter);
  app.use(usersURI.path, userRouter);

  // Register all routes before registering webpack middleware

  if (devServerEnabled) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackDevConfig = require('../../webpack.dev');

    const history = require('connect-history-api-fallback');
    const morgan = require('morgan');

    // Handles any requests that don't match the ones above
    app.use(history());

    // Enable request logging for development debugging
    app.use(morgan('dev'));

    const compiler = webpack(webpackDevConfig);
    // Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler));
    // Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
  }

  // For hosting build files, for production
  if (!devServerEnabled) {
    const webpackBuildDir = path.join(__dirname, '../../dist');
    app.use(express.static(webpackBuildDir));

    const htmlEntrypoint = path.join(webpackBuildDir, 'index.html');

    // Handles any requests that don't match the ones above
    app.get('/*', (req, res) => {
      res.sendFile(htmlEntrypoint);
    });
  }

  app.listen(port, () => {
    console.log('App listening on port: ' + port);
  });

  return app;
};
