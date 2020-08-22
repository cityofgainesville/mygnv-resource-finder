import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../../webpack.dev';

import history from 'connect-history-api-fallback';
import morgan from 'morgan';

import passport from './passport.js';
import categoryRouter, { path as categoryPath } from '../routes/CategoryRoute';
import locationRouter, { path as locationPath } from '../routes/LocationRoute';
import resourceRouter, { path as resourcePath } from '../routes/ResourceRoute';
import userRouter, { path as userPath } from '../routes/UserRoute';

import apolloPkg from 'apollo-server-express';
const { ApolloServer, gql } = apolloPkg;

// Populate process.env, for development
import dotenv from 'dotenv';
dotenv.config();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const developmentMode = 'development';
const devServerEnabled =
  process.argv.length >= 2 && process.argv[2] === developmentMode;

const dbUri = process.env.DB_URI ? process.env.DB_URI : '';
const port = process.env.PORT ? process.env.PORT : 8080;

export const start = () => {
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

  // Parse cookies
  app.use(cookieParser());

  app.use(passport.initialize());

  // Routes
  app.use(resourcePath, resourceRouter);
  app.use(locationPath, locationRouter);
  app.use(categoryPath, categoryRouter);
  app.use(userPath, userRouter);

  // GraphQL middleware
  app.use(apolloServer.getMiddleware({ path: '/graphql' }));

  // Register all routes before registering webpack middleware

  if (devServerEnabled) {
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
