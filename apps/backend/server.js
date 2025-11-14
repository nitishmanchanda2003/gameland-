// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/**************************************
 *  MIDDLEWARE
 **************************************/
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ Serve uploads folder (thumbnails + zip uploads)
app.use("/uploads", express.static("uploads"));

// ⭐ Serve extracted game folders
app.use("/games", express.static("public/games"));

/**************************************
 *  ROUTES IMPORT
 **************************************/
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

/**************************************
 *  ROUTES USE
 **************************************/
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

/**************************************
 *  PROTECTED TEST ROUTES
 **************************************/
import { protect, adminOnly } from "./middleware/authMiddleware.js";

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
 *  START SERVER
 **************************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
