const express = require("express");
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");

// Add the search route
router.get("/search-restaurants", searchRestaurant.searchRestaurantController);

module.exports = router;
