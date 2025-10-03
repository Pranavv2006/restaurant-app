const {
  CheckCustomerProfileService,
} = require("../services/CheckCustomerProfileService");

const checkCustomerProfileController = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await CheckCustomerProfileService(Number(userId));

    if (result.success) {
      return res.status(200).json({
        success: true,
        hasProfile: result.hasProfile,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        hasProfile: result.hasProfile,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in checkCustomerProfileController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { checkCustomerProfileController };
