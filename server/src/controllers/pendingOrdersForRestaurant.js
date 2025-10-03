const {
  PendingOrdersForRestaurantsService,
} = require("../services/PendingOrderForRestaurantsService");

const pendingOrdersForRestaurantController = async (req, res) => {
  const { restaurantId } = req.params;

  // Validate required parameter
  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Restaurant ID is required as a URL parameter.",
    });
  }

  // Convert to number and validate
  const restId = parseInt(restaurantId);

  if (isNaN(restId) || restId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid restaurant ID. Must be a positive integer.",
    });
  }

  try {
    const result = await PendingOrdersForRestaurantsService({
      restaurantId: restId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error(
      "PendingOrdersForRestaurant Controller Error:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving pending orders.",
    });
  }
};

module.exports = { pendingOrdersForRestaurantController };
