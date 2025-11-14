// backend/models/Game.js
import mongoose from "mongoose";
import slugify from "slugify";

const gameSchema = new mongoose.Schema(
  {
    /************************************
     * BASIC GAME INFO
     ************************************/
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    playUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    /************************************
     * ⭐ RATING SYSTEM
     ************************************/
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    // ⭐ IMPORTANT CHANGE — store IP + stars
    ratedIPs: [
      {
        ip: { type: String },
        stars: { type: Number, min: 1, max: 5 },
      },
    ],

    /************************************
     * ⭐ PLAY COUNT SYSTEM
     ************************************/
    playCount: {
      type: Number,
      default: 0,
    },

    playedIPs: [
      {
        ip: { type: String },
        time: { type: Number }, // timestamp
      },
    ],

    /************************************
     * ⭐ ANALYTICS (CALCULATED)
     ************************************/
    trendingScore: {
      type: Number,
      default: 0,
    },

    popularScore: {
      type: Number,
      default: 0,
    },

    /************************************
     * FLAGS
     ************************************/
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/************************************
 * AUTO SLUG
 ************************************/
gameSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

/************************************
 * INDEXES
 ************************************/
gameSchema.index({ title: 1 });
gameSchema.index({ slug: 1 });
gameSchema.index({ genre: 1 });
gameSchema.index({ trendingScore: -1 });
gameSchema.index({ popularScore: -1 });

export default mongoose.model("Game", gameSchema);
