/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const roles = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
};

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

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  session: false,
});

module.exports = mongoose.model('User', userSchema);

module.exports.basicUserData = (user) => {
  const {
    id,
    email,
    first_name,
    last_name,
    role,
    location_can_edit,
    resource_can_edit,
    cat_can_edit_resource_in,
  } = user;
  return {
    id,
    email,
    first_name,
    last_name,
    role,
    location_can_edit,
    resource_can_edit,
    cat_can_edit_resource_in,
  };
};

module.exports.roles = roles;
