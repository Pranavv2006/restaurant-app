const CreateCustomerProfileService = require("../services/CreateCustomerProfileService");

const createCustomerProfileController = async (req, res) => {
  const { userId, address, phone, latitude, longitude } = req.body;

  const result = await CreateCustomerProfileService({
    userId,
    address,
    phone,
    latitude,
    longitude,
  });

  if (result.success) {
    return res.status(201).json({ success: true, data: result.data });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

module.exports = { createCustomerProfileController };
