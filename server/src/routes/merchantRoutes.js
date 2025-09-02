const express = require("express");
const router = express.Router();

const check = require("../controllers/checkRestaurant");
const item = require("../controllers/addItem");
const create = require("../controllers/createRestaurant");
const profile = require("../controllers/merchantProfile");
const retrieveItems = require("../controllers/retrieveMenu");
const remove = require("../controllers/removeMenu");
const editItem = require("../controllers/editItem");
const weeklyOrders = require("../controllers/WeeklyOrders");

router.post("/create-restaurant", create.createRestaurantController);
router.post("/check-restaurant", check.checkRestaurantController);
router.post("/add-menu-item", item.addItemController);
router.get("/retrieve-menu", retrieveItems.retrieveMenuController);
router.delete("/remove-menu-item/:menuItemId", remove.removeMenuController);
router.get("/merchant-profile/:merchantId", profile.merchantProfileController);
router.put("/edit-menu-item/:menuItemId", editItem.EditMenuItemController);
router.get("/weekly-orders/:restaurantId", weeklyOrders.WeeklyOrdersController);

module.exports = router;
