const express = require("express");
const router = express.Router();

const addToCart = require("../controllers/addToCart");
const retrieveCart = require("../controllers/retrieveCart");
const updateCartItem = require("../controllers/updateCartItem");
const removeCartItem = require("../controllers/removeCartItem");
const checkCustomerAddress = require("../controllers/checkCustomerAddress");
const createCustomerAddress = require("../controllers/createCustomerAddress");
const editCustomerProfile = require("../controllers/editCustomerProfile");
const getAllCustomerAddresses = require("../controllers/getAllCustomerAddresses");
const setDefaultAddress = require("../controllers/setDefaultAddress");
const deleteAddress = require("../controllers/deleteAddress");
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

// Customer address routes
router.get(
  "/address/check/:userId",
  checkCustomerAddress.checkCustomerAddressController
);
router.get(
  "/addresses/:userId",
  getAllCustomerAddresses.getAllCustomerAddressesController
);
router.post(
  "/address/create",
  createCustomerAddress.createCustomerAddressController
);
router.put("/address/edit", editCustomerProfile.editCustomerProfileController);
router.put(
  "/address/setDefault",
  setDefaultAddress.setDefaultAddressController
);
router.delete(
  "/address/:userId/:addressId",
  deleteAddress.deleteAddressController
);

// Order management
router.post("/orders", placeOrder.placeOrderController);
router.get("/orders/:userId", getCustomerOrders.getCustomerOrdersController);

module.exports = router;
