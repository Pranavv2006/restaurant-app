const express = require('express');
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");
const selectRestaurant = require("../controllers/selectRestaurant");
const closeByRestaurants = require("../controllers/closeByRestaurants");
const ProximitySearch = require("../controllers/ProximitySearch");

router.get("/search-restaurants", searchRestaurant.searchRestaurantController);
router.get(
  "/select-restaurant/:restaurantId",
  selectRestaurant.selectRestaurantController
);
router.get("/restaurants/nearby", closeByRestaurants.closeByRestaurantsController);
router.get("/proximity-search", ProximitySearch.ProximitySearchController);

module.exports = router;