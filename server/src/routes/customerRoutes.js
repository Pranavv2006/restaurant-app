const express = require("express");
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");
const selectRestaurant = require("../controllers/selectRestaurant");

router.use((req, res, next) => {
  console.log(`🍽️ Customer route: ${req.method} ${req.path}`);
  next();
});

router.get("/search-restaurants", searchRestaurant.searchRestaurantController);
router.get(
  "/select-restaurant/:restaurantId",
  selectRestaurant.selectRestaurantController
);

module.exports = router;
