const { DeleteAddressService } = require("../services/DeleteAddressService");

const deleteAddressController = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const result = await DeleteAddressService({
      userId,
      addressId,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        data: result.data,
      });
    } else {
      let statusCode = 400;
      if (result.message.includes("not found")) {
        statusCode = 404;
      }
      return res.status(statusCode).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in deleteAddressController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { deleteAddressController };

module.exports = { deleteAddressController };