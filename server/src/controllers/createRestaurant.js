const CreateRestaurantService = require('../services/CreateRestaurantService');

const createRestaurantController = async (req, res) => {
    try {
        const { merchantId, name, location, phone, cuisine} = req.body;

        const result = await CreateRestaurantService.createRestaurant(merchantId, name, location, phone, cuisine);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createRestaurantController };
