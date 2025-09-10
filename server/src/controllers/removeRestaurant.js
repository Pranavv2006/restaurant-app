const {
  RemoveRestaurantService,
} = require("../services/RemoveRestaurantService");

const removeRestaurantController = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: "Restaurant ID is required",
      });
    }

    const result = await RemoveRestaurantService(restaurantId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Controller error removing restaurant:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = { removeRestaurantController };
