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
    let customer = await prisma.customer.findUnique({
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

    // If customer doesn't exist, check if user exists and has Customer role, then create customer profile
    if (!customer) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      // Check if user exists and has Customer role
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const hasCustomerRole = user.userRoles.some(
        userRole => userRole.role.type === 'Customer' && userRole.status
      );

      if (!hasCustomerRole) {
        return {
          success: false,
          message: "User is not a customer",
        };
      }

      // Create customer profile automatically
      customer = await prisma.customer.create({
        data: {
          userId: parseInt(userId),
        },
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

      // Also create an empty cart for the customer
      await prisma.cart.create({
        data: {
          customerId: customer.id,
        },
      });
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