const { SetDefaultAddressService } = require("../services/SetDefaultAddressService");

const setDefaultAddressController = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    const result = await SetDefaultAddressService({
      userId,
      addressId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Default address updated successfully",
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
    console.error("Error in setDefaultAddressController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { setDefaultAddressController };

module.exports = { setDefaultAddressController };