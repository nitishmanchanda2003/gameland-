// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000; // frontend se match kar raha hai

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
