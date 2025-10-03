const { PlaceOrderService } = require("../services/PlaceOrderService");

const placeOrderController = async (req, res) => {
  const { customerId, restaurantId, items } = req.body;

  // Validate required parameters
  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required.",
    });
  }

  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Restaurant ID is required.",
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one item is required to place an order.",
    });
  }

  // Validate customer ID and restaurant ID are numbers
  const custId = parseInt(customerId);
  const restId = parseInt(restaurantId);

  if (isNaN(custId) || custId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer ID. Must be a positive integer.",
    });
  }

  if (isNaN(restId) || restId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid restaurant ID. Must be a positive integer.",
    });
  }

  // Validate items array structure
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.id || !item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} is missing required fields (id, quantity).`,
      });
    }

    const itemId = parseInt(item.id);
    const quantity = parseInt(item.quantity);

    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid ID. Must be a positive integer.`,
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid quantity. Must be a positive integer.`,
      });
    }

    // Update the item with validated values
    items[i] = { id: itemId, quantity: quantity };
  }

  try {
    const result = await PlaceOrderService({
      customerId: custId,
      restaurantId: restId,
      items: items,
    });

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("PlaceOrder Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while placing the order.",
    });
  }
};

module.exports = { placeOrderController };
