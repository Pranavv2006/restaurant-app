const prisma = require("../models/prismaClient");

const PendingOrdersForRestaurantsService = async ({ restaurantId }) => {
  try {
    if (!restaurantId) {
      return {
        success: false,
        message: "Restaurant ID is required to retrieve pending orders.",
        data: null,
      };
    }

    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "pending",
        restaurantId: restaurantId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            customers: {
              select: {
                address: true,
                phone: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
            menu: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: "asc",
      },
    });

    const formattedOrders = pendingOrders.map((order) => {
      const customerProfile = order.user.customers?.[0];

      return {
        orderId: order.id,
        status: order.status,
        total: parseFloat(order.total),
        deliveryFee: parseFloat(order.deliveryFee),
        orderDate: order.orderDate,
        deliveryAddress: order.deliveryAddress,

        customer: {
          id: order.user.id,
          name: `${order.user.firstName} ${order.user.lastName}`,
          email: order.user.email,
          phone: customerProfile?.phone || null,
          defaultAddress: customerProfile?.address || null,
        },
        restaurant: order.restaurant,
        items: order.items.map((item) => ({
          itemId: item.id,
          menuId: item.menu.id,
          itemName: item.menu.name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          subtotal: parseFloat(item.subtotal),
        })),
      };
    });

    return {
      success: true,
      message: `${formattedOrders.length} pending orders retrieved for restaurant ID ${restaurantId}.`,
      data: formattedOrders,
    };
  } catch (error) {
    console.error("GetPendingOrdersByRestaurantService Error:", error.message);

    return {
      success: false,
      message:
        "An error occurred while retrieving pending orders for the restaurant.",
      data: null,
    };
  }
};

module.exports = { PendingOrdersForRestaurantsService };
