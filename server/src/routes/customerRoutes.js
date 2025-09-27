const express = require("express");
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");
const selectRestaurant = require("../controllers/selectRestaurant");
const addToCart = require("../controllers/addToCart");
const retrieveCart = require("../controllers/retrieveCart");
const updateCartItem = require("../controllers/updateCartItem");
const removeCartItem = require("../controllers/removeCartItem");

router.use((req, res, next) => {
  console.log(`🍽️ Customer route: ${req.method} ${req.path}`);
  next();
});

router.get("/search-restaurants", searchRestaurant.searchRestaurantController);
router.get(
  "/select-restaurant/:restaurantId",
  selectRestaurant.selectRestaurantController
);
router.post("/cart/add", addToCart);
router.get("/cart/:customerId", retrieveCart);
router.put("/cart/update", updateCartItem);
router.delete("/cart/remove/:cartItemId", removeCartItem);

module.exports = router;
