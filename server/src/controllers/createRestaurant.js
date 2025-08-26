const { createRestaurant } = require('../services/CreateRestaurantService');

const createRestaurantController = async (req, res) => {
    try {
        const { merchantId, name, location, phone, cuisine } = req.body;

        const restaurantData = {
            merchantId,
            name,
            location,
            phone,
            cuisine
        };

        console.log('Creating restaurant with data:', restaurantData);

        const result = await createRestaurant(restaurantData);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Create restaurant controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = { createRestaurantController };
