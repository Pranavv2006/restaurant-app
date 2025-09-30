const prisma = require("../models/prismaClient");

const RemoveCartItemService = async (cartItemId) => {
  try {
    if (!cartItemId) {
      return { success: false, message: "cartItemId is required." };
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      return { success: false, message: "Cart item not found." };
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { success: true, message: "Item removed from cart successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error removing cart item." };
  }
};

module.exports = RemoveCartItemService;
