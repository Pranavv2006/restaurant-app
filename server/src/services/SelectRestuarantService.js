const prisma = require("../models/prismaClient");

const SelectRestaurantService = async (restaurantId) => {
  try {
    if (!restaurantId) {
      return {
        success: false,
        data: [],
        message: "Invalid restaurant ID",
      };
    }

    // FIX 1: Convert the string restaurantId (from req.params) to an integer
    const idAsInt = parseInt(restaurantId, 10);

    // Basic validation check for the conversion
    if (isNaN(idAsInt)) {
      return {
        success: false,
        data: [],
        message: "Restaurant ID must be a valid number.",
      };
    } // FIX 2: Use the integer version of the ID in the Prisma query

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: idAsInt },
      include: {
        menus: true,
      },
    });

    // FIX 3: Structure the response data to match the frontend interface (menu instead of menus)
    if (!restaurant) {
      return {
        success: false,
        data: null,
        message: "Restaurant not found.",
      };
    }

    const formattedData = {
      restaurantName: restaurant.name, // Assuming the name is stored in 'name'
      menu: restaurant.menus || [], // Map Prisma 'menus' to frontend 'menu'
    };

    return {
      success: true,
      data: formattedData,
      message: "Restaurant Data successfully retrieved",
    };
  } catch (error) {
    console.error("Error selecting restaurant:", error);
    // Re-throw the error or return a proper failure response
    return {
      success: false,
      data: null,
      message: "An internal server error occurred.",
      error: error.message,
    };
  }
};

module.exports = { SelectRestaurantService };
