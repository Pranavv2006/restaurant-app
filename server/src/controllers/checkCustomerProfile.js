const CheckCustomerProfileService = require("../services/CheckCustomerProfileService");

const checkCustomerProfile = async (req, res) => {
  const { userId } = req.params;

  const result = await CheckCustomerProfileService(Number(userId));

  if (result.success) {
    return res.status(200).json({
      success: true,
      hasProfile: result.hasProfile,
      data: result.data,
    });
  } else {
    return res.status(404).json({
      success: false,
      hasProfile: result.hasProfile,
      message: result.message,
    });
  }
};

module.exports = checkCustomerProfile;
