const MerchantProfileService = require('../services/MerchantProfileService');

const merchantProfileController = async (req, res) => {
    try {
        const { merchantId } = req.params;

        const result = await MerchantProfileService.getMerchantProfile(merchantId);

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

module.exports = { merchantProfileController };