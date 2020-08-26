// Passport authentication setup with schema.

import passport from 'passport';
import PassportJwt from 'passport-jwt';
import dotenv from 'dotenv';

import { UserModel } from '../models/UserModel';

dotenv.config();

// These should be in .env
// secret (generated using `openssl rand -base64 48` from console)
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm = process.env.JWT_ALGORITHM;

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

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
      UserModel.findById(payload.id)
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

export default passport;
