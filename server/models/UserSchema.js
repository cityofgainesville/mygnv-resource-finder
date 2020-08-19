const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const roles = require('../config/roles');

// Integrates with "passport-local-mongoose"
// which handles hashing and salting passwords
// passwords are NOT stored
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.OWNER, roles.EDITOR],
    required: true,
  },
  // For Editor
  location_can_edit: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
  ],
  // For Editor
  resource_can_edit: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
    },
  ],
  // For Editor
  cat_can_edit_resource_in: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
