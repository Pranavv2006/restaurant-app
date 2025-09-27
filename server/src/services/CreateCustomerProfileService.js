const prisma = require("../models/prismaClient");

const CreateCustomerProfileService = async ({
  userId,
  address,
  phone,
  latitude,
  longitude,
}) => {
  try {
    if (!userId) {
      return { success: false, message: "userId is required." };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    // Check if customer profile already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { userId: userId },
    });

    if (existingCustomer) {
      return { success: false, message: "Customer profile already exists." };
    }

    // Create customer profile
    const customer = await prisma.customer.create({
      data: {
        userId: userId,
        address: address || null,
        phone: phone || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
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

    return { success: true, data: customer };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating customer profile." };
  }
};

module.exports = CreateCustomerProfileService;
