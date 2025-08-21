const AddMenuItemService = require('../services/AddMenuItemService');

const addMenuController = async (req, res) => {
    try {
        const { restaurantId, name, description, price, image_url } = req.body;

        const result = await AddMenuItemService.addMenuItem(restaurantId, name, description, price, image_url);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error(`Error in addMenuController: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {addMenuController};