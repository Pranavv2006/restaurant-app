const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { addMenuItem } = require("../services/AddMenuItemService");

const uploadsDir = path.join(__dirname, "../uploads/menu-items");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📁 Saving file to:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      "menu-item-" + uniqueSuffix + path.extname(file.originalname);
    console.log("📝 Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const addItemController = async (req, res) => {
  try {
    console.log("🍽️ Adding menu item...");
    console.log("📄 Request body:", req.body);
    console.log("📁 Uploaded file:", req.file);

    const { restaurantId, name, description, price } = req.body;
    const imageFile = req.file;

    if (!restaurantId || !name || !description || !price) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        error:
          "All fields are required: restaurantId, name, description, price",
      });
    }

    if (!imageFile) {
      console.log("❌ No image file provided");
      return res.status(400).json({
        success: false,
        error: "Image file is required",
      });
    }

    const imageUrl = `uploads/menu-items/${imageFile.filename}`;

    console.log(
      "💾 Image will be accessible at:",
      `http://localhost:3000/${imageUrl}`
    );

    const result = await addMenuItem(
      parseInt(restaurantId),
      name,
      description,
      parseFloat(price),
      imageUrl
    );

    if (result.success) {
      console.log("✅ Menu item added successfully");
      res.status(201).json(result);
    } else {
      console.log("❌ Failed to add menu item:", result.error);
      if (fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path);
        console.log("🗑️ Cleaned up uploaded file");
      }
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("❌ Error in addItemController:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log("🗑️ Cleaned up uploaded file due to error");
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum size is 5MB.",
      });
    }

    if (error.message === "Only image files are allowed!") {
      return res.status(400).json({
        success: false,
        error: "Only image files are allowed!",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  addItemController,
  uploadMiddleware: upload.single("image"),
};
