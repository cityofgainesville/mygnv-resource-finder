const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    enum: ['Provider', 'Editor', 'Owner'],
    required: true,
  },
  // For Provider
  assigned_provider: {
    type: String,
  },
  can_edit_assigned_provider: {
    type: Boolean,
  },
  // For Editor
  provider_can_edit: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
    },
  ],
  // For Editor
  cat_can_edit_provider_in: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
});

// If a user's role is changed to a more restrictive role, ensure that the old user data is also deleted
// eg. If role changes from Editor to Provider then clear out the provider_can_edit and cat_can_edit_provider
userSchema.pre('validate', (next, data) => {
  /* eslint-disable babel/no-invalid-this */
  if (this.role === 'Provider') {
    this.provider_can_edit = [];
    this.cat_can_edit_provider_in = [];
  }
  next();
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
