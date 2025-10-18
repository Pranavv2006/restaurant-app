const prisma = require("../models/prismaClient");

const CreateCustomerAddressService = async ({
  userId,
  label,
  addressLine,
  phone,
  latitude,
  longitude,
  isDefault = false,
}) => {
  try {
    if (!userId) {
      return { success: false, message: "userId is required." };
    }

    if (!addressLine) {
      return { success: false, message: "addressLine is required." };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    // Check if customer profile exists, create if not
    let customer = await prisma.customer.findUnique({
      where: { userId: userId },
      include: { addresses: true },
    });

    if (!customer) {
      // Create customer profile if it doesn't exist
      customer = await prisma.customer.create({
        data: {
          userId: userId,
          phone: phone || null,
        },
        include: { addresses: true },
      });
    } else if (phone && customer.phone !== phone) {
      // Update phone if provided and different
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { phone: phone },
        include: { addresses: true },
      });
    }

    // If this is the first address or explicitly set as default, make it default
    const isFirstAddress = customer.addresses.length === 0;
    const shouldBeDefault = isDefault || isFirstAddress;

    // If setting as default, update existing default addresses
    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: {
          customerId: customer.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create the new address
    const newAddress = await prisma.address.create({
      data: {
        customerId: customer.id,
        label: label || null,
        addressLine: addressLine,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isDefault: shouldBeDefault,
      },
    });

    // Fetch updated customer with all addresses
    const updatedCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
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
            { isDefault: 'desc' },
            { id: 'desc' }
          ],
        },
      },
    });

    return { 
      success: true, 
      data: {
        customer: updatedCustomer,
        newAddress: newAddress,
        totalAddresses: updatedCustomer.addresses.length,
      }
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating customer address." };
  }
};

module.exports = { CreateCustomerAddressService };
