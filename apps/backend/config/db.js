// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Remove deprecated warnings
    mongoose.set("strictQuery", false);

    const uri = process.env.MONGO_URI;
    console.log("🔌 Connecting to MongoDB Atlas...");

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
