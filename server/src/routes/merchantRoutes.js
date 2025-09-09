const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const check = require("../controllers/checkRestaurant");
const item = require("../controllers/addItem");
const create = require("../controllers/createRestaurant");
const profile = require("../controllers/merchantProfile");
const retrieveItems = require("../controllers/retrieveMenu");
const remove = require("../controllers/removeMenu");
const editItem = require("../controllers/editItem");
const weeklyOrders = require("../controllers/WeeklyOrders");
const retrieveRestaurant = require("../controllers/retrieveRestaurant");
const retrieveImage = require("../controllers/retrieveImage");

// Import the middleware array
const addMenuMiddleware = require("../middlewares/add-menu");

router.use((req, res, next) => {
  console.log(`🛒 Merchant route: ${req.method} ${req.path}`);
  if (req.file) {
    console.log("📁 File uploaded:", req.file);
  }
  if (req.files) {
    console.log("📁 Files uploaded:", req.files);
  }
  next();
});

router.post("/create-restaurant", create.createRestaurantController);
router.post("/check-restaurant", check.checkRestaurantController);

router.post("/add-menu-item", ...addMenuMiddleware);

router.get("/retrieve-menu", retrieveItems.retrieveMenuController);
router.delete("/remove-menu-item/:menuItemId", remove.removeMenuController);
router.get("/merchant-profile/:merchantId", profile.merchantProfileController);
router.put("/edit-menu-item/:menuItemId", editItem.EditMenuItemController);
router.get("/weekly-orders/:restaurantId", weeklyOrders.WeeklyOrdersController);

router.get("/test-image/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/menu-items", filename);

  console.log("Looking for file:", filePath);
  console.log("File exists:", fs.existsSync(filePath));

  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

router.get("/image/:filename", retrieveImage.retrieveImageController);

router.get(
  "/retrieve-restaurant/:merchantId",
  retrieveRestaurant.retrieveRestaurantController
);

module.exports = router;
