const MerchantProfileService = require("../services/MerchantProfileService");

const merchantProfileController = async (req, res) => {
  try {
    const { merchantId } = req.params;

    const result = await MerchantProfileService.getMerchantProfile(merchantId);

    if (result.success) {
      // Ensure restaurants include the imageUrl field
      if (result.data && result.data.restaurants) {
        result.data.restaurants = result.data.restaurants.map((restaurant) => ({
          ...restaurant,
          imageUrl: restaurant.imageUrl || "https://via.placeholder.com/150", // Default image if missing
        }));
      }

      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error in merchantProfileController:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { merchantProfileController };
