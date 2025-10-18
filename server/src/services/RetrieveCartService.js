const prisma = require("../models/prismaClient");

const RetrieveCartService = async (customerId) => {
  try {
    if (!customerId) {
      return { success: false, message: "customerId is required." };
    }

    // Find cart for customer
    let cart = await prisma.cart.findUnique({
      where: { customerId: customerId },
      include: {
        cartItems: {
          include: {
            menu: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
    });

    // If cart doesn't exist, create one for the customer
    if (!cart) {
      // First verify that the customer exists
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customer) {
        return { success: false, message: "Customer not found." };
      }

      // Create empty cart for customer
      cart = await prisma.cart.create({
        data: {
          customerId: customerId,
        },
        include: {
          cartItems: {
            include: {
              menu: {
                include: {
                  restaurant: true,
                },
              },
            },
          },
        },
      });
    }

    return { success: true, data: cart };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error retrieving cart." };
  }
};

module.exports = { RetrieveCartService };
