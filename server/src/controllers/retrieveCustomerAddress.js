const {
  retrieveCustomerAddressService,
} = require("../services/RetrieveCustomerAddressService");

const retrieveCustomerAddressController = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    const result = await retrieveCustomerAddressService(Number(customerId));

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.error || result.message,
      });
    }
  } catch (error) {
    console.error("Error in retrieveCustomerAddressController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { retrieveCustomerAddressController };
