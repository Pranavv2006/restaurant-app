const { GetAllCustomerAddressesService } = require("../services/GetAllCustomerAddressesService");

const getAllCustomerAddressesController = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await GetAllCustomerAddressesService({ userId });

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      const statusCode = result.message.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in getAllCustomerAddressesController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getAllCustomerAddressesController };

module.exports = { getAllCustomerAddressesController };