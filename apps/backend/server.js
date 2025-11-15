// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/**************************************
 *  CORS FIX (VERY IMPORTANT)
 **************************************/
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/**************************************
 *  EXPRESS MIDDLEWARE
 **************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**************************************
 *  ROUTES IMPORT
 **************************************/
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";

/**************************************
 *  API ROUTES (MUST COME BEFORE STATIC)
 **************************************/
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/favorites", favoriteRoutes);

/**************************************
 *  PROTECTED TEST ROUTES
 **************************************/
app.get("/api/user/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/api/admin/check", protect, adminOnly, (req, res) => {
  res.json({ message: "You are an Admin ✔" });
});

/**************************************
 *  BASIC TEST ROUTE
 **************************************/
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/**************************************
 *  STATIC ROUTES — ALWAYS AT BOTTOM
 **************************************/
app.use("/uploads", express.static("uploads"));
app.use("/games", express.static("public/games"));

/**************************************
 *  START SERVER
 **************************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
