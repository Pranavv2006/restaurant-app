const express = require("express");
const router = express.Router();

const addToCart = require("../controllers/addToCart");
const retrieveCart = require("../controllers/retrieveCart");
const updateCartItem = require("../controllers/updateCartItem");
const removeCartItem = require("../controllers/removeCartItem");
const checkCustomerProfile = require("../controllers/checkCustomerProfile");
const createCustomerProfile = require("../controllers/createCustomerProfile");
const editCustomerProfile = require("../controllers/editCustomerProfile");
const placeOrder = require("../controllers/placeOrder");
const retrieveAddress = require("../controllers/retrieveCustomerAddress");
const getCustomerOrders = require("../controllers/getCustomerOrders");

router.use((req, res, next) => {
  console.log(`🍽️ Customer route: ${req.method} ${req.path}`);
  next();
});


router.get(
  "/address/:customerId",
  retrieveAddress.retrieveCustomerAddressController
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

// Order management
router.post("/orders", placeOrder.placeOrderController);
router.get("/orders/:userId", getCustomerOrders.getCustomerOrdersController);

module.exports = router;
