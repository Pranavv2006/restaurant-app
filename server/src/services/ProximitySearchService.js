const prisma = require("../models/prismaClient");

function calculateDistance(lat1, lon1, lat2, lon2) {
  // ... (existing distance calculation code)
}

const ProximitySearchService = async (
  latitude,
  longitude,
  radiusKm = 10,
  query // Accept the query parameter
) => {
  try {
    // Validate coordinates
    if (!latitude || !longitude) {
      return {
        success: false,
        message: "Latitude and longitude are required for proximity search.",
        data: [],
      };
    }

    // Validate radius
    if (radiusKm < 0 || radiusKm > 100) {
      return {
        success: false,
        message: "Radius must be between 0 and 100 kilometers.",
        data: [],
      };
    }

    // Build the WHERE clause for Prisma
    const prismaWhere = {
        latitude: { not: null },
        longitude: { not: null },
    };

    // Add text search filter if query provided
    if (query && typeof query === 'string' && query.trim().length > 0) {
        const searchTerm = query.trim();
        prismaWhere.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { cuisine: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } }
        ];
    }

    // 2. Fetch restaurants matching the text query
    const restaurants = await prisma.restaurant.findMany({
      where: prismaWhere, // <-- Use the combined where clause
    });

    if (restaurants.length === 0) {
      return {
        success: true,
        // Updated message
        message: "No restaurants found matching your criteria in the database.",
        data: [],
      };
    }

    // 3. PROXIMITY FILTERING (only on the results from the database)
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
      const message = query 
        ? `No restaurants found within ${radiusKm}km matching "${query}".`
        : `No restaurants found within ${radiusKm}km of your location.`;
      
      return {
        success: true,
        message,
        data: [],
      };
    }

    const message = query 
      ? `Found ${filtered.length} restaurant(s) within ${radiusKm}km matching "${query}".`
      : `Found ${filtered.length} restaurant(s) within ${radiusKm}km of your location.`;

    return {
      success: true,
      message,
      data: filtered,
    };
  } catch (error) {
    console.error("Error in ProximitySearchService:", error);

    return {
      success: false,
      message: "An unexpected error occurred during search.",
    };
  }
};

module.exports = { ProximitySearchService };