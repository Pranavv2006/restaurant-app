const { addMenuItem } = require("../services/AddMenuItemService");

const addItemController = async (req, res) => {
  try {
    const { restaurantId, name, description, price, imageUrl } = req.body;

    console.log("Received add menu item request:", {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
    });

    // Validate required fields
    if (!restaurantId || !name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: restaurantId, name, description, price",
      });
    }

    // Validate data types
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

    // Call the service
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
