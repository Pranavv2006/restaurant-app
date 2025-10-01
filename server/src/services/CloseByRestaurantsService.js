const prisma = require("../models/prismaClient");

/**
 * Converts degrees to radians.
 * @param {number} degrees
 * @returns {number} Radians
 */
const deg2rad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 *
 * @param {number} lat1 - Latitude of point 1 (customer).
 * @param {number} lon1 - Longitude of point 1 (customer).
 * @param {number} lat2 - Latitude of point 2 (restaurant).
 * @param {number} lon2 - Longitude of point 2 (restaurant).
 * @returns {number} Distance in kilometers (km).
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 *
 * @param {number} latitude - Customer's current latitude.
 * @param {number} longitude - Customer's current longitude.
 * @param {number} [radiusKm=10] - The maximum search radius in kilometers.
 * @returns {object} { success: boolean, message: string, data: Restaurant[] }
 */
const CloseByRestaurantsService = async ({
  latitude,
  longitude,
  radiusKm = 10,
}) => {
  try {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("Valid latitude and longitude are required.");
    }

    const customerLat = parseFloat(latitude);
    const customerLon = parseFloat(longitude);
    const maxRadius = parseFloat(radiusKm);

    const allRestaurants = await prisma.restaurant.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        location: true,
        cuisine: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
      },
    });

    const nearbyRestaurants = [];

    for (const restaurant of allRestaurants) {
      const restLat = parseFloat(restaurant.latitude);
      const restLon = parseFloat(restaurant.longitude);

      const distance = calculateDistance(
        customerLat,
        customerLon,
        restLat,
        restLon
      );

      if (distance <= maxRadius) {
        nearbyRestaurants.push({
          id: restaurant.id,
          name: restaurant.name,
          location: restaurant.location,
          cuisine: restaurant.cuisine,
          imageUrl: restaurant.imageUrl,
          distanceKm: parseFloat(distance.toFixed(2)),
        });
      }
    }

    nearbyRestaurants.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      success: true,
      message: `${nearbyRestaurants.length} restaurants found within ${maxRadius} km.`,
      data: nearbyRestaurants,
    };
  } catch (error) {
    console.error("GetNearbyRestaurantsService Error:", error.message);

    // Return error following the design pattern: { success: bool, message: str, data: null }
    return {
      success: false,
      message: error.message || "Could not retrieve nearby restaurants.",
      data: null,
    };
  }
};

module.exports = { CloseByRestaurantsService, calculateDistance };
