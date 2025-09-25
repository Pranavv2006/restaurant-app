const prisma = require("@prisma/client");

const SelectRestaurantService = async (restaurantId) => {
  try {
    if (!restaurantId) {
      return {
        success: false,
        data: [],
        message: "Invalid restaurant ID",
      };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menus: true,
      },
    });
    return restaurant;
  } catch (error) {
    console.error("Error selecting restaurant:", error); // It's good practice to log the error.
    throw new Error("Error selecting restaurant with menus.");
  }
};

module.exports = { SelectRestaurantService };
