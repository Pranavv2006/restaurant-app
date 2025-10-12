import { ProximitySearchService } from "../services/ProximitySearchService.js";

const ProximitySearchController = async (req, res) => {
  try {
    const { latitude, longitude, radiusKm } = req.query;

    const result = await ProximitySearchService(
      parseFloat(latitude),
      parseFloat(longitude),
      radiusKm ? parseFloat(radiusKm) : 10
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