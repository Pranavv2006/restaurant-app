const path = require("path");
const fs = require("fs");

const retrieveImageController = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads/menu-items", filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }
  } catch (error) {
    console.error("Error in retrieveImageController:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

module.exports = { retrieveImageController };
