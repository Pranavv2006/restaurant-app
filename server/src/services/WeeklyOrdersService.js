const prisma = require("../models/prismaClient");

const WeeklyOrders = async (restaurantId) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const orders = await prisma.order.groupBy({
      by: ["order_date"],
      where: {
        restaurant_id: restaurantId,
        order_date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      _count: {
        id: true,
      },
    });

    const formatted = orders.map((order) => ({
      date: order.order_date.toISOString().split("T")[0],
      count: order._count.id,
    }));

    return {
      success: true,
      data: formatted.length > 0 ? formatted : [],
      message:
        formatted.length > 0
          ? "Weekly data fetched successfully"
          : "No orders found for the past week",
    };
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    return {
      success: false,
      error: "Failed to fetch weekly orders",
    };
  }
};

module.exports = { WeeklyOrders };
