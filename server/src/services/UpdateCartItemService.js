const prisma = require("../models/prismaClient");

const UpdateCartItemService = async ({ cartItemId, quantity }) => {
  try {
    if (!cartItemId || quantity === undefined) {
      return {
        success: false,
        message: "cartItemId and quantity are required.",
      };
    }

    if (quantity <= 0) {
      return { success: false, message: "Quantity must be greater than 0." };
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      return { success: false, message: "Cart item not found." };
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity },
    });

    return { success: true, data: updatedCartItem };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating cart item." };
  }
};

module.exports = { UpdateCartItemService };
