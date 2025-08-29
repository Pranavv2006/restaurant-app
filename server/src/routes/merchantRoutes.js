const express = require("express");
const router = express.Router();

const check = require("../controllers/checkRestaurant");
const item = require("../controllers/addItem");
const create = require("../controllers/createRestaurant");
const profile = require("../controllers/merchantProfile");
const removeItem = require("../controllers/removeMenu");
const retrieveItems = require("../controllers/retrieveMenu");

router.post("/create-restaurant", create.createRestaurantController);
router.post("/check-restaurant", check.checkRestaurantController);
router.post("/add-item", item.addMenuController);
router.delete("/remove-item", removeItem.removeMenuController);
router.get("/retrieve-menu", retrieveItems.retrieveMenuController);
router.get("/merchant-profile/:merchantId", profile.merchantProfileController);

module.exports = router;
