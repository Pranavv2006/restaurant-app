const EditCustomerProfileService = require("../services/EditCustomerProfileService");

const editCustomerProfile = async (req, res) => {
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
};

module.exports = editCustomerProfile;
