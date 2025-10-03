const { RemoveMenuItemService } = require("../services/RemoveMenuItemService");

const removeMenuController = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const result = await RemoveMenuItemService.removeMenuItem(menuItemId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { removeMenuController };
