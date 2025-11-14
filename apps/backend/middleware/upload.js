// backend/middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

/********************************************************
 *  Ensure upload folders exist
 ********************************************************/
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

ensureFolder("uploads/thumbnails");
ensureFolder("uploads/zips");

/********************************************************
 *  Thumbnail Storage (Images)
 ********************************************************/
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/thumbnails/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// IMAGE FILTER
const imageFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PNG/JPG thumbnails allowed"), false);
  }
  cb(null, true);
};

/********************************************************
 *  ZIP Storage (Game HTML ZIP)
 ********************************************************/
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/zips/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// ZIP FILTER
const zipFilter = (req, file, cb) => {
  if (file.mimetype !== "application/zip" && file.mimetype !== "application/x-zip-compressed") {
    return cb(new Error("Only ZIP files allowed"), false);
  }
  cb(null, true);
};

/********************************************************
 *  Combined Upload Using .fields()
 ********************************************************/
export const uploadFiles = multer({
  storage: multer.diskStorage({}),
}).fields([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "gameZip",
    maxCount: 1,
  }
]);

export const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
}).single("thumbnail");

export const uploadZip = multer({
  storage: zipStorage,
  fileFilter: zipFilter,
}).single("gameZip");
