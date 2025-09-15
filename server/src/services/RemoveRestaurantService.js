const prisma = require("../models/prismaClient");

const RemoveRestaurantService = async (restaurantId) => {
  try {
    const id = Number(restaurantId);
    if (!id || isNaN(id)) {
      return {
        success: false,
        message: "Invalid restaurant ID",
        data: null,
      };
    }

    const removedRestaurant = await prisma.restaurant.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Restaurant removed successfully",
      data: {
        name: removedRestaurant.name,
        location: removedRestaurant.location,
        phone: removedRestaurant.phone,
        cuisine: removedRestaurant.cuisine,
        imageUrl: removedRestaurant.imageUrl,
      },
    };
  } catch (error) {
    console.error("Error removing restaurant:", error);
    return {
      success: false,
      message: error.message || "Failed to remove restaurant",
      data: null,
    };
  }
};

module.exports = { RemoveRestaurantService };
