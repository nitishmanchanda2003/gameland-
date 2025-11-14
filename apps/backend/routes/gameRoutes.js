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
import { uploadFiles } from "../middleware/uploadMiddleware.js"; // ⭐ 1 middleware for both thumbnail + zip

const router = express.Router();

/**************************************
 * PUBLIC ROUTES
 **************************************/
router.get("/", getAllGames);
router.get("/:id", getGameById);

/**************************************
 * ADMIN ROUTES (FILE UPLOAD + AUTH)
 **************************************/
router.post(
  "/",
  protect,
  adminOnly,
  uploadFiles,  // ⭐ required: handles thumbnail + zip
  createGame
);

router.put("/:id", protect, adminOnly, updateGame);
router.delete("/:id", protect, adminOnly, deleteGame);

export default router;
