const UpdateCartItemService = require("../services/UpdateCartItemService");

const updateCartItemController = async (req, res) => {
  const { cartItemId, quantity } = req.body;

  const result = await UpdateCartItemService({ cartItemId, quantity });

  if (result.success) {
    return res.status(200).json({ success: true, data: result.data });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

module.exports = { updateCartItemController };
