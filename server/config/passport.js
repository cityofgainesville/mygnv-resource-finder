// Passport authentication setup with schema.

const passport = require('passport');
const JWT = require('jsonwebtoken');
const PassportJwt = require('passport-jwt');
const User = require('../models/UserSchema');

const dotenv = require('dotenv');
dotenv.config();

// These should be in .env
// secret (generated using `openssl rand -base64 48` from console)
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm = process.env.JWT_ALGORITHM;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new PassportJwt.Strategy(
    // Options
    {
      // Where will the JWT be passed in the HTTP request?
      // e.g. Authorization: Bearer xxxxxxxxxx
      jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      // What is the secret
      secretOrKey: jwtSecret,
      // What algorithm(s) were used to sign it?
      algorithms: [jwtAlgorithm],
    },
    // When we have a verified token
    (payload, done) => {
      // Find the real user from our database using the `id` in the JWT
      User.findById(payload.sub)
        .then((user) => {
          // If user was found with this id
          if (user) {
            done(null, user);
          } else {
            // If not user was found
            done(null, false);
          }
        })
        .catch((error) => {
          // If there was failure
          done(error, false);
        });
    }
  )
);

module.exports = passport;
