// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

// Middleware
import { protect, adminOnly } from "./middleware/authMiddleware.js";

// Load .env variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// ⭐ PROTECTED ROUTE (Test for token)
app.get("/api/user/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
