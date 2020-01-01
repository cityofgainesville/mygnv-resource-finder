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
  assigned_provider: {
    type: String,
    required: () => {
      // eslint-disable-next-line babel/no-invalid-this
      return this.role == 'Provider';
    },
  },
  can_edit_assigned_provider: {
    type: Boolean,
    required: () => {
      // eslint-disable-next-line babel/no-invalid-this
      return this.role == 'Provider';
    },
  },
  provider_can_edit: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: () => {
        // eslint-disable-next-line babel/no-invalid-this
        return this.role == 'Editor';
      },
    },
  ],
  cat_can_edit_in: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: () => {
        // eslint-disable-next-line babel/no-invalid-this
        return this.role == 'Editor';
      },
    },
  ],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
