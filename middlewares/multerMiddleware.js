const multer = require("multer");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}-${file.originalname}`); // Unique file name with timestamp
  },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/svg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Only image files are allowed (png, jpg, jpeg, webp, svg)"),
      false
    ); // Reject the file
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;
