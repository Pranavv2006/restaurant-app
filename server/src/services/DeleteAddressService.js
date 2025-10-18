const prisma = require("../models/prismaClient");

const DeleteAddressService = async ({ userId, addressId }) => {
  try {
    if (!userId || !addressId) {
      return {
        success: false,
        message: "User ID and Address ID are required",
      };
    }

    // Find customer by userId
    const customer = await prisma.customer.findUnique({
      where: { userId: parseInt(userId) },
      include: { addresses: true },
    });

    if (!customer) {
      return {
        success: false,
        message: "Customer not found",
      };
    }

    // Check if the address belongs to this customer
    const targetAddress = customer.addresses.find(addr => addr.id === parseInt(addressId));
    if (!targetAddress) {
      return {
        success: false,
        message: "Address not found or doesn't belong to this customer",
      };
    }

    // Check if this is the only address
    if (customer.addresses.length === 1) {
      return {
        success: false,
        message: "Cannot delete the only address. Customer must have at least one address.",
      };
    }

    const wasDefault = targetAddress.isDefault;

    // Delete the address
    await prisma.address.delete({
      where: {
        id: parseInt(addressId),
      },
    });

    // If the deleted address was default, set another address as default
    if (wasDefault) {
      const remainingAddresses = customer.addresses.filter(addr => addr.id !== parseInt(addressId));
      if (remainingAddresses.length > 0) {
        await prisma.address.update({
          where: {
            id: remainingAddresses[0].id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    // Get updated customer with addresses
    const updatedCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
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

    return {
      success: true,
      data: {
        customer: updatedCustomer,
        remainingAddresses: updatedCustomer.addresses.length,
        deletedAddressId: parseInt(addressId),
      },
    };
  } catch (error) {
    console.error("Error in DeleteAddressService:", error);
    return {
      success: false,
      message: "Error deleting address",
    };
  }
};

module.exports = { DeleteAddressService };