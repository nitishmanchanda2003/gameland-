// backend/routes/gameRoutes.js
import express from "express";
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllGames);
router.get("/:id", getGameById);

// ADMIN ROUTES
router.post("/", protect, adminOnly, uploadFiles, createGame);

router.put("/:id", protect, adminOnly, uploadFiles, updateGame);

router.delete("/:id", protect, adminOnly, deleteGame);

export default router;
