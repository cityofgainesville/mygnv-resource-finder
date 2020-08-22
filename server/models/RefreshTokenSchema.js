import mongoose from 'mongoose';
const { Schema } = mongoose;

import ms from 'ms';
import dotenv from 'dotenv';

dotenv.config();

const refreshTokenExpiration = ms(process.env.REFRESH_TOKEN_EXPIRATION);

const documentExpires = new Date(Date.now() + 2 * refreshTokenExpiration);

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, unique: true, required: true },
  // expires: { type: Date, required: true },
  created: {
    type: Date,
    default: Date.now,
    expires: ms(documentExpires.getTime()),
    index: true,
  },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
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

export default mongoose.model('RefreshToken', refreshTokenSchema);
