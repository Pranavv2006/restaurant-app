const multer = require("multer");
const path = require("path");
const { addMenuItem } = require("../services/AddMenuItemService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/menu-items/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "menu-item-" + uniqueSuffix + path.extname(file.originalname));
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
    const { restaurantId, name, description, price } = req.body;
    const imageFile = req.file;

    console.log("Add menu item request:", {
      restaurantId,
      name,
      description,
      price,
      imageFile: imageFile ? imageFile.filename : "No file",
    });

    if (!restaurantId || !name || !description || !price) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: "Image file is required",
      });
    }

    const imageUrl = `/uploads/menu-items/${imageFile.filename}`;

    const result = await addMenuItem(
      parseInt(restaurantId),
      name,
      description,
      parseFloat(price),
      imageUrl
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in addItemController:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = {
  addItemController,
  uploadMiddleware: upload.single("image"),
};
