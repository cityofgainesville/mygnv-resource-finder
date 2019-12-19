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
  organization: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Provider', 'Editor', 'Owner'],
    required: true,
  },
  provider_can_edit: [{ type: Schema.Types.ObjectId, ref: 'Provider' }],
  cat_can_edit_in: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
