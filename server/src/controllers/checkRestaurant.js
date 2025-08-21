const CheckRestaurantService = require('../services/CheckRestaurantService');

const checkRestaurantController = async (req, res) => {
    try {
        const { restaurantId } = req.body;

        const result = await CheckRestaurantService.checkRestaurant(restaurantId);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {checkRestaurantController};
