const express = require("express");
const router = express.Router();

const check = require("../controllers/checkRestaurant");
const item = require("../controllers/addItem");
const create = require("../controllers/createRestaurant");
const profile = require("../controllers/merchantProfile");
const retrieveItems = require("../controllers/retrieveMenu");
const remove = require("../controllers/removeMenuItem");
const editItem = require("../controllers/editItem");

router.post("/create-restaurant", create.createRestaurantController);
router.post("/check-restaurant", check.checkRestaurantController);
router.post("/add-menu-item", item.addItemController);
router.get("/retrieve-menu", retrieveItems.retrieveMenuController);
router.delete("/remove-menu-item/:menuItemId", remove.removeMenuItemController);
router.get("/merchant-profile/:merchantId", profile.merchantProfileController);
router.put("/edit-menu-item", editItem.EditMenuItemController);

module.exports = router;
