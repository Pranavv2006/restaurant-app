const prisma = require("../models/prismaClient");

const AddToCartService = async ({ customerId, menuId, quantity = 1 }) => {
  try {
    if (!customerId || !menuId) {
      return { success: false, message: "customerId and menuId are required." };
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return {
        success: false,
        message:
          "Customer profile not found. Please complete your customer profile before adding items to cart.",
      };
    }
    
    let cart = await prisma.cart.findUnique({
      where: { customerId: customerId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId: customerId },
      });
    }

    // Find menu item
    const menuItem = await prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menuItem) {
      return { success: false, message: "Menu item not found." };
    }

    // Check if item already in cart
    let cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, menuId: menuId },
    });

    if (cartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          unitPrice: menuItem.price,
        },
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuId: menuId,
          quantity,
          unitPrice: menuItem.price,
        },
      });
    }

    return {
      success: true,
      data: cartItem,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error adding to cart." };
  }
};

module.exports = { AddToCartService };
