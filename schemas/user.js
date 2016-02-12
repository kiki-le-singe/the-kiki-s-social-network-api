// https://github.com/Automattic/mongoose/tree/master/examples/schema

import mongoose from 'mongoose'; // MongoDB integration
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, required: true, trim: true, unique : true },
  email: { type: String, required: true, trim: true, lowercase: true, unique : true },
  password: { type: String, required: true, trim: true },
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  born: { type: Date },
  bio: { type: String },
  connectedStatus: { type: Number, default: 0 }, // 0: disconnected, 1: connected
  lastLogin: { type: Date, default: Date.now }, // user's last login
  slug: { type: String, lowercase: true, trim: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
  validated: { type: Number, default: 0 }, // 0: blocked, 1: active
  activationKey: { type: String }, // Key to activate the user from email confirmation.
});
const User = mongoose.model('User', UserSchema);


// Apply the uniqueValidator plugin to userSchema.
UserSchema.plugin(uniqueValidator);

/**
 * Pre hook.
 */

UserSchema.pre('save', function(next, done) {
  this.slug = `${this.get('username')}`;
  next();
});

export default User;
