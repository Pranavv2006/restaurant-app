const express = require('express');
const router = express.Router();

const item = require('../controllers/addItem');
const check = require('../controllers/checkRestaurant');
const create = require('../controllers/createRestaurant');
const profile = require('../controllers/merchantProfile');
const removeItem = require('../controllers/removeMenu');

router.post('/create-restaurant', create.createRestaurantController);
router.post('/check-restaurant', check.checkRestaurantController);
router.post('/add-item', item.addMenuController);
router.post('/remove-item', removeItem.removeMenuController);
router.delete('/merchant-profile/:merchantId', profile.merchantProfileController);

module.exports = router;