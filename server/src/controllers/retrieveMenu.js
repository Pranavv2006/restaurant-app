const {
  retrieveMerchantMenu,
} = require("../services/retrieveMerchantMenuService");

const retrieveMenuController = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    console.log("Received restaurantId:", restaurantId);

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: "Restaurant ID is required",
      });
    }

    const result = await retrieveMerchantMenu(restaurantId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in retrieveMenuController:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { retrieveMenuController };
