const { RemoveCartItemService } = require("../services/RemoveCartItemService");

const removeCartItemController = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const result = await RemoveCartItemService(Number(cartItemId));

    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in removeCartItemController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { removeCartItemController };
