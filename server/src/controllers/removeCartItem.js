const RemoveCartItemService = require("../services/RemoveCartItemService");

const removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  const result = await RemoveCartItemService(Number(cartItemId));

  if (result.success) {
    return res.status(200).json({ success: true, message: result.message });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

module.exports = removeCartItem;
