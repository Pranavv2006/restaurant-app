const {
  EditCustomerProfileService,
} = require("../services/EditCustomerProfileService");

const editCustomerProfileController = async (req, res) => {
  try {
    const { customerId, address, phone, latitude, longitude } = req.body;

    const result = await EditCustomerProfileService({
      customerId,
      address,
      phone,
      latitude,
      longitude,
    });

    if (result.success) {
      return res.status(200).json({ success: true, data: result.data });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in editCustomerProfileController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { editCustomerProfileController };
