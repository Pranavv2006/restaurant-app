const { RetrieveCartService } = require("../services/RetrieveCartService");

const retrieveCartController = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await RetrieveCartService(Number(customerId));

    if (result.success) {
      return res.status(200).json({ success: true, data: result.data });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in retrieveCartController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { retrieveCartController };
