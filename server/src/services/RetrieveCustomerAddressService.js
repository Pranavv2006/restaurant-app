const prisma = require("../models/prismaClient");
const retrieveCustomerAddressService = async (customerId) => {
  try {
    if (!customerId) {
      return {
        success: false,
        error: "Customer ID is required.",
      };
    }

    const customerAddress = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        address: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!customerAddress) {
      return {
        success: true,
        data: null,
        error: "Customer not found.",
      };
    }

    return {
      success: true,
      data: {
        address: customerAddress.address,
        latitude: customerAddress.latitude,
        longitude: customerAddress.longitude,
      },
    };
  } catch (error) {
    console.error("Error retrieving customer address:", error);
    return {
      success: false,
      error:
        "An internal server error occurred while fetching the customer address.",
    };
  }
};

module.exports = {
  retrieveCustomerAddressService,
};
