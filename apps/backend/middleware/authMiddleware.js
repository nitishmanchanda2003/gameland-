// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/********************************************************
 *  PROTECT → Verify Token + Attach req.user
 ********************************************************/
export const protect = async (req, res, next) => {
  try {
    let token;

    // Accept Bearer Token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Attach user
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    // Token expired or invalid
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/********************************************************
 *  ADMIN-ONLY MIDDLEWARE
 ********************************************************/
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admins only",
      });
    }

    next();
  } catch (err) {
    console.error("ADMIN CHECK ERROR:", err.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
