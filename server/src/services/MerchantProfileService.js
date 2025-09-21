const prisma = require("../models/prismaClient");

const getMerchantProfile = async (merchantId) => {
  try {
    const merchant = await prisma.user.findUnique({
      where: { id: parseInt(merchantId, 10) },
      include: {
        restaurants: true,
      },
    });

    if (!merchant) {
      return {
        success: false,
        message: "Merchant not found",
      };
    }

    return {
      success: true,
      data: {
        id: merchant.id,
        email: merchant.email,
        firstName: merchant.firstName,
        lastName: merchant.lastName,
        restaurants: merchant.restaurants.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          location: restaurant.location,
          phone: restaurant.phone,
          cuisine: restaurant.cuisine,
          imageUrl: restaurant.imageUrl, // Include imageUrl
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching merchant profile:", error);
    return {
      success: false,
      message: "Failed to fetch merchant profile",
      error: error.message,
    };
  }
};

module.exports = { getMerchantProfile };
