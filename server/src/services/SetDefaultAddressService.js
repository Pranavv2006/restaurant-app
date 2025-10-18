const prisma = require("../models/prismaClient");

const SetDefaultAddressService = async ({ userId, addressId }) => {
  try {
    if (!userId || !addressId) {
      return { 
        success: false, 
        message: "User ID and Address ID are required" 
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
        message: "Customer not found" 
      };
    }

    // Check if the address belongs to this customer
    const targetAddress = customer.addresses.find(addr => addr.id === parseInt(addressId));
    if (!targetAddress) {
      return { 
        success: false, 
        message: "Address not found or doesn't belong to this customer" 
      };
    }

    // Update all addresses to not be default
    await prisma.address.updateMany({
      where: {
        customerId: customer.id,
      },
      data: {
        isDefault: false,
      },
    });

    // Set the target address as default
    const updatedAddress = await prisma.address.update({
      where: {
        id: parseInt(addressId),
      },
      data: {
        isDefault: true,
      },
    });

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
        updatedAddress: updatedAddress,
        defaultAddress: updatedAddress,
        totalAddresses: updatedCustomer.addresses.length,
      }
    };
  } catch (error) {
    console.error("Error in SetDefaultAddressService:", error);
    return { 
      success: false, 
      message: "Error updating default address" 
    };
  }
};

module.exports = { SetDefaultAddressService };