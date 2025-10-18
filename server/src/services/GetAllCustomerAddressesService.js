const prisma = require("../models/prismaClient");

const GetAllCustomerAddressesService = async ({ userId }) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    // Find customer by userId
    const customer = await prisma.customer.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { id: 'desc' }
          ],
        },
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
        message: "Customer not found",
      };
    }

    const defaultAddress = customer.addresses.find(addr => addr.isDefault);

    return {
      success: true,
      data: {
        customer: {
          id: customer.id,
          userId: customer.userId,
          phone: customer.phone,
          user: customer.user,
        },
        addresses: customer.addresses,
        defaultAddress: defaultAddress || null,
        totalAddresses: customer.addresses.length,
      },
    };
  } catch (error) {
    console.error("Error in GetAllCustomerAddressesService:", error);
    return {
      success: false,
      message: "Error retrieving customer addresses",
    };
  }
};

module.exports = { GetAllCustomerAddressesService };