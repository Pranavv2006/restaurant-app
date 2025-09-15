const { createRestaurant } = require("../services/CreateRestaurantService");
const upload = require("../middlewares/upload"); // Import the multer configuration

const createRestaurantController = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload image",
      });
    }

    try {
      const { merchantId, name, location, phone, cuisine } = req.body;
      const imageUrl = req.file
        ? `uploads/restaurants/${req.file.filename}`
        : null;

      const restaurantData = {
        merchantId,
        name,
        location,
        phone,
        cuisine,
        imageUrl, // Include image URL
      };

      console.log("Creating restaurant with data:", restaurantData);

      const result = await createRestaurant(restaurantData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Create restaurant controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
};

module.exports = { createRestaurantController };
