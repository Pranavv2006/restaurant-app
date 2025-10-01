const {
  GetNearbyRestaurantsService,
} = require("../services/CloseByRestaurantsService");

const closeByRestaurants = async (req, res) => {
  const { latitude, longitude, radiusKm } = req.query;

  // Validate required parameters
  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required parameters.",
    });
  }

  // Convert to numbers and validate
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const radius = radiusKm ? parseFloat(radiusKm) : 10; // Default 10km radius

  if (
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude or longitude values.",
    });
  }

  if (radiusKm && (isNaN(radius) || radius <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Invalid radius value. Must be a positive number.",
    });
  }

  try {
    const result = await GetNearbyRestaurantsService({
      latitude: lat,
      longitude: lon,
      radiusKm: radius,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("CloseByRestaurants Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving nearby restaurants.",
    });
  }
};

module.exports = closeByRestaurants;
