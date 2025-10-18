const {
  CheckCustomerAddressService,
} = require("../services/CheckCustomerAddressService");

const checkCustomerAddressController = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await CheckCustomerAddressService(Number(userId));

    if (result.success) {
      return res.status(200).json({
        success: true,
        hasAddress: result.hasAddress,
        data: result.data,
        message: result.message,
      });
    } else {
      return res.status(result.hasAddress === false ? 200 : 404).json({
        success: false,
        hasAddress: result.hasAddress,
        data: result.data || null,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in checkCustomerAddressController:", error);
    return res.status(500).json({
      success: false,
      hasAddress: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { checkCustomerAddressController };
