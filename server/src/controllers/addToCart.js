const AddToCartService = require("../services/AddToCartService");

const addToCart = async (req, res) => {
  const { customerId, menuId, quantity } = req.body;

  const result = await AddToCartService({ customerId, menuId, quantity });

  if (result.success) {
    return res.status(200).json({ success: true, data: result.data });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

module.exports = addToCart;
