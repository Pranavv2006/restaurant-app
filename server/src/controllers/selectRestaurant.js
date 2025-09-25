const {
  SelectRestaurantService,
} = require("../services/SelectRestuarantService");

const selectRestaurantController = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await SelectRestaurantService(restaurantId);
    return res.status(200).json({
      success: true,
      data: restaurant,
      message: "Restaurant retrieved successfully",
    });
  } catch (error) {
    console.error("Error selecting restaurant:", error);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Error selecting restaurant",
    });
  }
};
module.exports = { selectRestaurantController };
