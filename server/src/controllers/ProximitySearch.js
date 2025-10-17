const { ProximitySearchService } = require("../services/ProximitySearchService");

const ProximitySearchController = async (req, res) => {
  try {
    // ADD 'query' here to extract it from the URL parameters
    const { latitude, longitude, radiusKm, query } = req.query; 

    const result = await ProximitySearchService(
      parseFloat(latitude),
      parseFloat(longitude),
      radiusKm ? parseFloat(radiusKm) : 10,
      query // <-- PASS 'query' to the service function
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      data: null,
    });
  }
};

module.exports = { ProximitySearchController };