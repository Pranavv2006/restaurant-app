const {
  GetCustomerOrdersService,
} = require("../services/GetCustomerOrdersService");

const getCustomerOrdersController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await GetCustomerOrdersService(Number(userId));

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in getCustomerOrdersController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { getCustomerOrdersController };
