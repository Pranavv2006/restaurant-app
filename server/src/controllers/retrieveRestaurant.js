const retrieveRestaurant = require("../services/RetrieveRestaurantService");

const retrieveRestaurantController = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const result = await retrieveRestaurant(merchantId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        success: false,
        error: result.message,
      });
    }
  } catch (error) {
    console.error("Error retrieving restaurant:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = { retrieveRestaurantController };
