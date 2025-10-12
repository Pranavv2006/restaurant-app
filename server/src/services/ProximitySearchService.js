const prisma = require("../models/prismaClient");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ProximitySearchService = async (
  latitude,
  longitude,
  radiusKm = 10
) => {
  try {
    if (
      latitude === undefined ||
      longitude === undefined ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return {
        success: false,
        message: "Latitude and longitude must be valid numbers.",
        data: null,
      };
    }

    if (radiusKm <= 0 || isNaN(radiusKm)) {
      return {
        success: false,
        message: "Radius must be a positive number.",
        data: null,
      };
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
    });

    if (restaurants.length === 0) {
      return {
        success: true,
        message: "No restaurants found in the database.",
        data: [],
      };
    }

    const filtered = restaurants
      .map((restaurant) => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(restaurant.latitude),
          parseFloat(restaurant.longitude)
        );
        return { ...restaurant, distance };
      })
      .filter((r) => r.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    if (filtered.length === 0) {
      return {
        success: true,
        message: "No restaurants found within the specified radius.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Nearby restaurants fetched successfully.",
      data: filtered,
    };
  } catch (error) {
    console.error("Error in ProximitySearchService:", error);

    return {
      success: false,
      message: "An unexpected error occurred while fetching nearby restaurants.",
      data: null,
    };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { ProximitySearchService };