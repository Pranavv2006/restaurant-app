const prisma = require("../models/prismaClient");

/**
 * @param {string} query - The search string
 * @returns {Promise<{success: boolean, data?: any[], message?: string}>}
 */
const searchRestaurants = async (query) => {
  try {
    if (!query || !query.trim()) {
      return { success: false, data: [], message: "No search query provided" };
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { cuisine: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: restaurants };
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return { success: false, data: [], message: error.message };
  }
};

module.exports = { searchRestaurants };
