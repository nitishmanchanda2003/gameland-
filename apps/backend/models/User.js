// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  // ⭐ For Google Login (no password required)
  googleId: {
    type: String,
    default: null,
  },

  picture: {
    type: String,
    default: null,
  },

  // ⭐ Normal Login (email/password)
  password: {
    type: String,
    minlength: 6,
    default: null,   // google users ke liye password null rahega
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
