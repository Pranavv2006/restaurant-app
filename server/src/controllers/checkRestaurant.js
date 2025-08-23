const { checkRestaurantService } = require('../services/CheckRestaurantService');

const checkRestaurantController = async (req, res) => {
    try {
        const { merchantId } = req.body || {};

        if (!merchantId && !(req.user && req.user.id)) {
            return res.status(400).json({ success: false, message: 'Merchant ID not provided' });
        }

        const idToCheck = merchantId ? Number(merchantId) : Number(req.user.id);
        console.log('Checking restaurant for merchant:', idToCheck);

        const result = await checkRestaurantService(idToCheck);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Check restaurant controller error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = { checkRestaurantController };
