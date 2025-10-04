const prisma = require("../models/prismaClient");

const RetrieveCartService = async (customerId) => {
  try {
    if (!customerId) {
      return { success: false, message: "customerId is required." };
    }

    // Find cart for customer
    const cart = await prisma.cart.findUnique({
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

    if (!cart) {
      return { success: false, message: "Cart not found for this customer." };
    }

    return { success: true, data: cart };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error retrieving cart." };
  }
};

module.exports = { RetrieveCartService };
