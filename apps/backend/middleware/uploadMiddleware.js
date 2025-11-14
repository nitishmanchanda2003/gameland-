// backend/middleware/uploadMiddleware.js
import multer from "multer";
import fs from "fs";

/************************************
 * Ensure upload folders exist
 ************************************/
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

ensureFolder("uploads/thumbnails");
ensureFolder("uploads/zips");

/************************************
 * STORAGE ENGINE
 ************************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, "uploads/thumbnails/");
    } else if (file.fieldname === "gameZip") {
      cb(null, "uploads/zips/");
    }
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

/************************************
 * FILE FILTER
 ************************************/
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Thumbnail must be an image"), false);
    }
  }

  if (file.fieldname === "gameZip") {
    if (!file.originalname.endsWith(".zip")) {
      return cb(new Error("Game ZIP must be a .zip file"), false);
    }
  }

  cb(null, true);
};

/************************************
 * FINAL MULTER UPLOADER
 ************************************/
export const uploadFiles = multer({
  storage,
  fileFilter,
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gameZip", maxCount: 1 },
]);
