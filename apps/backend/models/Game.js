// backend/models/Game.js
import mongoose from "mongoose";
import slugify from "slugify";

const gameSchema = new mongoose.Schema(
  {
    // Game title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // URL-friendly slug
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },

    // Genre / Category
    genre: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Thumbnail image path
    thumbnail: {
      type: String,
      required: true,
    },

    // Playable game URL -> /games/<slug>/index.html
    playUrl: {
      type: String,
      required: true,
    },

    // Short description
    description: {
      type: String,
      default: "",
    },

    // Rating
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    // Flags
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    // Analytics
    playCount: {
      type: Number,
      default: 0,
    },

    // Which admin uploaded it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/******************************************
 * AUTO SLUG CREATE IF MISSING
 ******************************************/
gameSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

/******************************************
 * Indexes for faster search
 ******************************************/
gameSchema.index({ title: 1 });
gameSchema.index({ slug: 1 });
gameSchema.index({ genre: 1 });

export default mongoose.model("Game", gameSchema);
