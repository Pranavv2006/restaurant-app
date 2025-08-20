const MenuItem = require('../services/AddMenuItemService');
const checkRestaurant = require('../services/CheckRestaurantService');
const profile = require('../services/MerchantProfile');
const create = require('../services/CreateRestaurantService');
const remove = require('../services/RemoveMenuItemService');

const addMenuController = (req, res) => {
    const { restaurantId, name, description, price, image_url } = req.body;
}