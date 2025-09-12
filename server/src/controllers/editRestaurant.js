const { EditRestaurantService } = require("../services/EditRestaurantService");

const editRestaurantController = async (req, res) => {
  try {
    const { restaurantId, name, location, phone, cuisine } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = "uploads/restaurants/" + req.file.filename;
    }

    const updateData = { name, location, phone, cuisine, imageUrl };
    const result = await EditRestaurantService(restaurantId, updateData);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Controller error editing restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = { editRestaurantController };
