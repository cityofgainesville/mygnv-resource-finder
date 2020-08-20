const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ms = require('ms');
const dotenv = require('dotenv');
dotenv.config();

const refreshTokenExpiration = ms(process.env.REFRESH_TOKEN_EXPIRATION);

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: refreshTokenExpiration },
  },
});

refreshTokenSchema.virtual('isExpired').get(function() {
  // eslint-disable-next-line babel/no-invalid-this
  return Date.now() >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(function() {
  // eslint-disable-next-line babel/no-invalid-this
  return !this.revoked && !this.isExpired;
});

refreshTokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);