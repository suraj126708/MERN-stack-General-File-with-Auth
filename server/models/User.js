const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Model
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
