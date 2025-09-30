const {
  SelectRestaurantService,
} = require("../services/SelectRestuarantService");

const selectRestaurantController = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    // The service returns { success, data, message, error }
    const serviceResult = await SelectRestaurantService(restaurantId);

    // FIX: Check the service result success flag and return its contents directly.
    if (serviceResult.success) {
      // Return the formatted data (restaurantName, menu) and success message
      return res.status(200).json({
        success: true,
        data: serviceResult.data, // This is the formattedData object (restaurantName, menu)
        message: serviceResult.message,
      });
    } else {
      // Handle service-level validation errors (e.g., ID not found)
      return res.status(404).json({
        success: false,
        data: null,
        message: serviceResult.message || "Restaurant selection failed.",
      });
    }
  } catch (error) {
    console.error("Error selecting restaurant:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Error selecting restaurant due to internal server error",
    });
  }
};
module.exports = { selectRestaurantController };
