// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

// Middleware
import { protect, adminOnly } from "./middleware/authMiddleware.js";

// Load environment variables
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
    origin: "*", // development ke liye OK
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

/**************************************
 *  ROUTES
 **************************************/
app.use("/api/auth", authRoutes);

// Protected Route Example — Token Required
app.get("/api/user/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Admin Only Example — (optional)
app.get("/api/admin/check", protect, adminOnly, (req, res) => {
  res.json({ message: "You are an Admin ✔" });
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/**************************************
 *  START SERVER
 **************************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
