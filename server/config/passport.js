// Passport authentication setup with schema.

const passport = require('passport');
const User = require('../models/UserSchema');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
