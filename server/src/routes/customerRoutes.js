const express = require("express");
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");

router.get("/search-restaurants", searchRestaurant.searchRestaurantController);

module.exports = router;
