const WeeklyOrdersService = require("../services/WeeklyOrdersService");

const WeeklyOrdersController = async (req, res) => {
  try {
    console.log("🔥 WeeklyOrders controller hit!");
    console.log("Request params:", req.params);

    const { restaurantId } = req.params;

    if (!restaurantId) {
      console.log("❌ No restaurantId provided");
      return res.status(400).json({
        success: false,
        error: "Restaurant ID is required",
      });
    }

    if (isNaN(parseInt(restaurantId))) {
      console.log("❌ Invalid restaurantId:", restaurantId);
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant ID",
      });
    }

    console.log(
      "✅ Calling WeeklyOrdersService with restaurantId:",
      restaurantId
    );

    const result = await WeeklyOrdersService.WeeklyOrders(
      parseInt(restaurantId)
    );

    console.log("📊 Service result:", result);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("💥 Error fetching weekly orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weekly orders: " + error.message,
    });
  }
};

module.exports = { WeeklyOrdersController };
