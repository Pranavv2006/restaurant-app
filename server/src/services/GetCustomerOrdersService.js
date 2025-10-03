const prisma = require("../models/prismaClient");

const GetCustomerOrdersService = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    // First, get the customer ID from the user ID
    const customer = await prisma.customer.findUnique({
      where: { userId: userId },
    });

    if (!customer) {
      return {
        success: false,
        message: "Customer profile not found",
      };
    }

    // Get all orders for this customer
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        orderItems: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("Error in GetCustomerOrdersService:", error);
    return {
      success: false,
      message: error.message || "Failed to retrieve customer orders",
    };
  }
};

module.exports = { GetCustomerOrdersService };
