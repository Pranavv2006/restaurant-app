const prisma = require("../models/prismaClient");

const EditCustomerProfileService = async ({
  customerId,
  address,
  phone,
  latitude,
  longitude,
}) => {
  try {
    if (!customerId) {
      return { success: false, message: "customerId is required." };
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      return { success: false, message: "Customer profile not found." };
    }

    // Update customer profile
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        address: address !== undefined ? address : existingCustomer.address,
        phone: phone !== undefined ? phone : existingCustomer.phone,
        latitude:
          latitude !== undefined
            ? latitude
              ? parseFloat(latitude)
              : null
            : existingCustomer.latitude,
        longitude:
          longitude !== undefined
            ? longitude
              ? parseFloat(longitude)
              : null
            : existingCustomer.longitude,
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

    return { success: true, data: updatedCustomer };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating customer profile." };
  }
};

module.exports = { EditCustomerProfileService };
