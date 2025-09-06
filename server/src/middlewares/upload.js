const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Ensure the directory exists
const ensureUploadsDirectory = () => {
  const uploadPath = path.join(__dirname, "../../uploads/restaurants");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively
  }
};

// Call the function to ensure the directory exists
ensureUploadsDirectory();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/restaurants");
    cb(null, uploadPath); // Save files to the correct directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `restaurant-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

module.exports = upload;
