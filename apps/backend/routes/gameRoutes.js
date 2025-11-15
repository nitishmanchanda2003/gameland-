// backend/routes/gameRoutes.js
import express from "express";
import {
  getAllGames,
  getGameById,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame,
  increasePlayCount,
  rateGame,
} from "../controllers/gameController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/******************************************
 * ⭐ PUBLIC ROUTES
 ******************************************/

// Fetch all games
router.get("/", getAllGames);

// Fetch by ID
router.get("/id/:id", getGameById);

// Fetch by Slug
router.get("/slug/:slug", getGameBySlug);

/******************************************
 * ⭐ GAME INTERACTIONS (PUBLIC + AUTH)
 ******************************************/

// Play count (no login required)
router.post("/:id/play", increasePlayCount);

// Rating (login required)
router.post("/:id/rate", protect, rateGame);

/******************************************
 * ⭐ ADMIN ROUTES
 ******************************************/

// Create new game
router.post("/", protect, adminOnly, uploadFiles, createGame);

// Update game
router.put("/:id", protect, adminOnly, uploadFiles, updateGame);

// Delete game
router.delete("/:id", protect, adminOnly, deleteGame);

export default router;
