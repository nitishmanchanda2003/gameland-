import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🎉 Connected Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test error:", err.message);
    process.exit(1);
  }
})();
