const prisma = require("../models/prismaClient");

const retrieveRestaurantService = async (merchantId) => {
  try {
    if (!merchantId) {
      return {
        success: false,
        message: "Merchant ID is required",
        data: [],
      };
    }
    const merchantIdNum = Number(merchantId);
    if (!Number.isInteger(merchantIdNum)) {
      return {
        success: false,
        message: "Invalid merchant ID format",
        data: [],
      };
    }
    const restaurants = await prisma.restaurant.findMany({
      where: { merchantId: merchantIdNum },
      include: {
        menus: true,
        orders: true,
      },
    });

    if (!restaurants || restaurants.length === 0) {
      return {
        success: false,
        message: "No restaurants found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Restaurants retrieved successfully",
      data: restaurants,
    };
  } catch (error) {
    console.error("Error retrieving restaurant:", error);
    return {
      success: false,
      message: "Error retrieving restaurant",
      data: [],
    };
  }
};

module.exports = { retrieveRestaurantService };
