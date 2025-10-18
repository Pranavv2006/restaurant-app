const {
  CreateCustomerAddressService,
} = require("../services/CreateCustomerAddressService");

const createCustomerAddressController = async (req, res) => {
  try {
    const { userId, label, addressLine, phone, latitude, longitude, isDefault } = req.body;

    const result = await CreateCustomerAddressService({
      userId,
      label,
      addressLine,
      phone,
      latitude,
      longitude,
      isDefault,
    });

    if (result.success) {
      return res.status(201).json({ 
        success: true, 
        message: "Address created successfully",
        data: result.data 
      });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in createCustomerAddressController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { createCustomerAddressController };
