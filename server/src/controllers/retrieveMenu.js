const RetrieveMenuService = require('../services/RetrieveMenuService');

const retrieveMenuController = async (req, res) => {
    try{
        const {restaurantId} = req.body;
        const result = await RetrieveMenuService.retrieveMenu(restaurantId);

        if(result.success){
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { retrieveMenuController };