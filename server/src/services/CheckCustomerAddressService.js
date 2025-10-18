const prisma = require("../models/prismaClient");

const CheckCustomerAddressService = async (userId) => {
  try {
    if (!userId) {
      return { success: false, message: "userId is required." };
    }

    // Check if customer exists and has addresses
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
        addresses: {
          orderBy: [
            { isDefault: 'desc' }, // Default address first
            { id: 'desc' }         // Then by most recent
          ]
        },
      },
    });

    if (!customer) {
      return {
        success: false,
        hasAddress: false,
        message: "Customer not found.",
      };
    }

    // Check if customer has any addresses
    if (!customer.addresses || customer.addresses.length === 0) {
      return {
        success: false,
        hasAddress: false,
        message: "Customer has no delivery addresses.",
        data: customer, // Return customer data even without addresses
      };
    }

    // Find default address or use the first one
    const defaultAddress = customer.addresses.find(addr => addr.isDefault) || customer.addresses[0];

    return {
      success: true,
      hasAddress: true,
      data: {
        ...customer,
        defaultAddress,
        totalAddresses: customer.addresses.length,
      },
      message: `Customer has ${customer.addresses.length} address(es).`,
    };
  } catch (error) {
    console.error("Error in CheckCustomerAddressService:", error);
    return {
      success: false,
      hasAddress: false,
      message: "Error checking customer addresses.",
    };
  }
};

module.exports = { CheckCustomerAddressService };
