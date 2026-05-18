const multer = require("multer");
const path = require("path");

// ── Storage for Game Images ───────────────────────────────────────────────────
const gameStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/games"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// ── Storage for Profile Images ────────────────────────────────────────────────
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// ── File Filter (images only) ─────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
  }
};

const gameUpload = multer({ storage: gameStorage, fileFilter: imageFilter });
const profileUpload = multer({ storage: profileStorage, fileFilter: imageFilter });

module.exports = { gameUpload, profileUpload };
