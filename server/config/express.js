const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');

const providerRouter = require('../routes/ProviderRoute');
const categoryRouter = require('../routes/CategoryRoute');
const userRouter = require('../routes/UserRoute');

const developmentMode = 'development';
const devServerEnabled =
  process.argv.length >= 2 && process.argv[2] === developmentMode;

// Populate process.env, for development
require('dotenv').config();

const dbUri = process.env.DB_URI ? process.env.DB_URI : '';
const port = process.env.PORT ? process.env.PORT : 8080;
const sessionSecret = process.env.SESSION_SECRET
  ? process.env.SESSION_SECRET
  : 'lol cats';

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

  app.use(
    session({
      secret: sessionSecret,
      // Session should expire after 2 days
      maxAge: 2 * DAY_IN_MS,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.use('/api/provider', providerRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/user', userRouter);

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
