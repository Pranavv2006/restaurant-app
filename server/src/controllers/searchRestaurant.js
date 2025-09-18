const { searchRestaurants } = require("../services/SearchRestaurantService");

const searchRestaurantController = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await searchRestaurants(q);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Controller error searching restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
};

module.exports = { searchRestaurantController };
