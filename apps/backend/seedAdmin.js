// backend/seedAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

// MONGO CONNECT
await connectDB();

// ADMIN DETAILS (tum yahan change kar sakte ho)
const adminData = {
  name: "Super Admin",
  email: "admin@gameland.com",
  password: "Admin@123", // default password
  role: "admin",
};

async function seedAdmin() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      console.log("❗ Admin already exists:", adminExists.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(adminData.password, salt);

    // Create new admin
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPass,
      role: "admin",
    });

    console.log("✅ Admin Created Successfully!");
    console.log("Login Email:", admin.email);
    console.log("Login Password:", adminData.password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
}

seedAdmin();
