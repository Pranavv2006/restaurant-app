const { addMenuItem } = require("../services/AddMenuItemService");

const addItemController = async (req, res) => {
  try {
    const { restaurantId, name, description, price, imageUrl } = req.body;

    if (!restaurantId || !name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: restaurantId, name, description, price",
      });
    }

    const restaurantIdNum = Number(restaurantId);
    const priceNum = Number(price);

    if (!Number.isInteger(restaurantIdNum)) {
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant ID",
      });
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid price",
      });
    }

    const result = await addMenuItem(
      restaurantIdNum,
      name,
      description,
      priceNum,
      imageUrl || ""
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in addItemController:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = { addItemController };
