const RetrieveMenuService = require('../services/RetrieveMenuService');

const retrieveMenuController = async (req, res) => {
    const { restaurantId } = req.body;

    const result = await RetrieveMenuService.retrieveMerchantMenu(restaurantId);

    if (!result.success) {
        return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({ menu: result.data });
};

module.exports = { retrieveMenuController };