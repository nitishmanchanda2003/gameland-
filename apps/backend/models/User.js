// backend/models/User.js
import mongoose from "mongoose";

const ratedGameSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
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

    // ⭐ Google Login
    googleId: {
      type: String,
      default: null,
    },

    picture: {
      type: String,
      default: null,
    },

    // ⭐ Normal Login
    password: {
      type: String,
      minlength: 6,
      default: null, // google accounts ke liye null allowed
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /**************************************
     * ⭐ FAVOURITES — Game Wishlist
     **************************************/
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],

    /**************************************
     * ⭐ RATED GAMES — Track user's ratings
     **************************************/
    ratedGames: [ratedGameSchema],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
