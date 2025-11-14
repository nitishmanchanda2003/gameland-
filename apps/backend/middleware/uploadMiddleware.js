import multer from "multer";
import path from "path";

// Thumbnail Storage
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/thumbnails/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

// ZIP Storage
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/zips/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files allowed"), false);
  }

  if (file.fieldname === "gameZip") {
    if (
      !file.mimetype.includes("zip") &&
      !file.originalname.endsWith(".zip")
    ) {
      return cb(new Error("Only ZIP file allowed"), false);
    }
  }

  cb(null, true);
};

// Multer Instance (multi upload)
export const uploadFiles = multer({
  storage: (req, file, cb) => {
    if (file.fieldname === "thumbnail") return cb(null, thumbnailStorage);
    if (file.fieldname === "gameZip") return cb(null, zipStorage);
  },
  fileFilter,
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gameZip", maxCount: 1 },
]);
