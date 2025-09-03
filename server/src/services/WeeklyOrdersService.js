const prisma = require("../models/prismaClient");

const WeeklyOrders = async (restaurantId) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    console.log("Fetching orders for restaurant:", restaurantId);
    console.log("Date range:", monday, "to", sunday);

    const orders = await prisma.order.groupBy({
      by: ["orderDate"],
      where: {
        restaurantId: restaurantId,
        orderDate: {
          gte: monday,
          lte: sunday,
        },
      },
      _count: {
        id: true,
      },
    });

    console.log("Found orders:", orders);

    const orderMap = new Map(
      orders.map((order) => [
        order.orderDate.toISOString().split("T")[0],
        order._count.id,
      ])
    );

    const formatted = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      formatted.push({
        date: dateStr,
        count: orderMap.get(dateStr) || 0,
      });
    }

    console.log("Formatted weekly data:", formatted);

    return {
      success: true,
      data: formatted,
      message: "Weekly data (Mon–Sun) fetched successfully",
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
