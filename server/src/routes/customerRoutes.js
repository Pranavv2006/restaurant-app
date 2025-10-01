const express = require("express");
const router = express.Router();

const searchRestaurant = require("../controllers/searchRestaurant");
const selectRestaurant = require("../controllers/selectRestaurant");
const addToCart = require("../controllers/addToCart");
const retrieveCart = require("../controllers/retrieveCart");
const updateCartItem = require("../controllers/updateCartItem");
const removeCartItem = require("../controllers/removeCartItem");
const checkCustomerProfile = require("../controllers/checkCustomerProfile");
const createCustomerProfile = require("../controllers/createCustomerProfile");
const editCustomerProfile = require("../controllers/editCustomerProfile");
const closeByRestaurants = require("../controllers/closeByRestaurants");
const placeOrder = require("../controllers/placeOrder");

router.use((req, res, next) => {
  console.log(`🍽️ Customer route: ${req.method} ${req.path}`);
  next();
});

router.get("/search-restaurants", searchRestaurant.searchRestaurantController);
router.get(
  "/select-restaurant/:restaurantId",
  selectRestaurant.selectRestaurantController
);
router.post("/cart/add", addToCart.addToCartController);
router.get("/cart/:customerId", retrieveCart.retrieveCartController);
router.put("/cart/update", updateCartItem.updateCartItemController);
router.delete(
  "/cart/remove/:cartItemId",
  removeCartItem.removeCartItemController
);

// Customer profile routes
router.get(
  "/profile/check/:userId",
  checkCustomerProfile.checkCustomerProfileController
);
router.post(
  "/profile/create",
  createCustomerProfile.createCustomerProfileController
);
router.put("/profile/edit", editCustomerProfile.editCustomerProfileController);

// Location-based restaurant search
router.get(
  "/restaurants/nearby",
  closeByRestaurants.closeByRestaurantsController
);

// Order management
router.post("/orders", placeOrder.placeOrderController);

module.exports = router;
