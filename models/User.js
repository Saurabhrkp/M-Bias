const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String },
    avatar: { type: Schema.ObjectId, ref: 'Photo', required: false },
    username: { type: String, unique: true, lowercase: true },
    phone: { type: Number, required: false },
    shortBio: { type: String, required: false, max: 50 },
    posts: [{ type: Schema.ObjectId, ref: 'Post', required: false }],
    password: { type: String },
    email: { type: String, lowercase: true },
    github: { type: String, required: false },
    saved: [{ type: Schema.ObjectId, ref: 'Post', required: false }],
    author: { type: Boolean, required: true, default: false },
  } /* gives us "createdAt" and "updatedAt" fields automatically */,
  { timestamps: true }
);

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
UserSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', UserSchema);

module.exports = User;
