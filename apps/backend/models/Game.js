// backend/models/Game.js
import mongoose from "mongoose";
import slugify from "slugify";

const gameSchema = new mongoose.Schema(
  {
    // Game title – e.g. "Space Runner"
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Auto-generated slug from title (URL friendly)
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Game Category / Genre – e.g. "Action", "Racing"
    genre: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // GameCard & GameDetail thumbnail
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional banner image for GameDetail top header
    banner: {
      type: String,
      default: "",
      trim: true,
    },

    // Playable URL (iframe src)
    gameUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Description for Game Detail page
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Rating 0–5
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    // Homepage flags (Trending / New)
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    // Analytics – How many times played
    playCount: {
      type: Number,
      default: 0,
    },

    // Which admin uploaded the game
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
 * AUTO-GENERATE SLUG BEFORE SAVE
 ************************************/
gameSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

/************************************
 * UNIQUE INDEX FOR FAST SEARCH
 ************************************/
gameSchema.index({ title: 1 });
gameSchema.index({ slug: 1 });
gameSchema.index({ genre: 1 });

export default mongoose.model("Game", gameSchema);
