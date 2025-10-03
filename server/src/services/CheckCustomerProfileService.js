const prisma = require("../models/prismaClient");

const CheckCustomerProfileService = async (userId) => {
  try {
    if (!userId) {
      return { success: false, message: "userId is required." };
    }

    // Check if customer profile exists
    const customer = await prisma.customer.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!customer) {
      return {
        success: false,
        hasProfile: false,
        message: "Customer profile not found.",
      };
    }

    return {
      success: true,
      hasProfile: true,
      data: customer,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      hasProfile: false,
      message: "Error checking customer profile.",
    };
  }
};

module.exports = { CheckCustomerProfileService };
