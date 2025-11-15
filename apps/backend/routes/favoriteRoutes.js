import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  toggleFavorite,
  getUserFavorites
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/toggle/:gameId", protect, toggleFavorite);

router.get("/my-favorites", protect, getUserFavorites);

export default router;
