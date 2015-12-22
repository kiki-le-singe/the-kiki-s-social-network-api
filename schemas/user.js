// https://github.com/Automattic/mongoose/tree/master/examples/schema

import mongoose from 'mongoose'; // MongoDB integration

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, trim: true },
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  born: { type: Date },
  bio: { type: String },
  // 0: disconnected, 1: connected, 2: disabled
  status: { type: Number, default: 0 },
  slug: { type: String, lowercase: true, trim: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
  validated: { type: Boolean, default: false },
  access_tokens: { type: String },
});
const User = mongoose.model('User', UserSchema);


/**
 * Pre hook.
 */

UserSchema.pre('save', function(next, done) {
  this.slug = `${this.get('username')}`;
  next();
});

export default User;
