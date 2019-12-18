const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Integrates with "passport-local-mongoose"
// which handles hashing and salting passwords
// passwords are NOT stored
// An email field is used instead of a username field
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
