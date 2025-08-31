const EditMenuItemService = require("../services/EditMenuItemService");

const EditMenuItemController = async (req, res) => {
  try {
    const { menuItemId, name, description, price, imageUrl } = req.body;

    const result = await EditMenuItemService.editMenuItem(
      menuItemId,
      name,
      description,
      price,
      imageUrl
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in EditMenuItemController:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { EditMenuItemController };
