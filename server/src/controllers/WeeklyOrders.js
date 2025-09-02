const WeeklyOrdersService = require("../services/WeeklyOrdersService");

const WeeklyOrdersController = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await WeeklyOrdersService.WeeklyOrders(
      parseInt(restaurantId)
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weekly orders",
    });
  }
};

module.exports = { WeeklyOrdersController };
