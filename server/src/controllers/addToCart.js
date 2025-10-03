const { AddToCartService } = require("../services/AddToCartService");

const addToCartController = async (req, res) => {
  try {
    const { customerId, menuId, quantity } = req.body;

    const result = await AddToCartService({ customerId, menuId, quantity });

    if (result.success) {
      return res.status(200).json({ success: true, data: result.data });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in addToCartController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { addToCartController };
