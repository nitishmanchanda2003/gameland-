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
  rateGame
} from "../controllers/gameController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/******************************************
 * ⭐ PUBLIC ROUTES
 ******************************************/

// All games
router.get("/", getAllGames);

// One game by ID
router.get("/id/:id", getGameById);

// One game by Slug
router.get("/slug/:slug", getGameBySlug);

/******************************************
 * ⭐ GAME INTERACTIONS
 ******************************************/

// Play Count (+ Anti-Spam)
router.post("/:id/play", increasePlayCount);

// Rating (+ Anti-Spam)
router.post("/:id/rate", rateGame);

/******************************************
 * ⭐ ADMIN
 ******************************************/
router.post("/", protect, adminOnly, uploadFiles, createGame);

router.put("/:id", protect, adminOnly, uploadFiles, updateGame);

router.delete("/:id", protect, adminOnly, deleteGame);

export default router;
