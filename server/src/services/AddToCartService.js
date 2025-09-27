const prisma = require("../models/prismaClient");

const AddToCartService = async ({ customerId, menuId, quantity = 1 }) => {
  try {
    if (!customerId || !menuId) {
      return { success: false, message: "customerId and menuId are required." };
    }

    // Find or create cart for customer
    let cart = await prisma.cart.findUnique({
      where: { customer_id: customerId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customer_id: customerId },
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
      where: { cart_id: cart.id, menu_id: menuId },
    });

    if (cartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          unit_price: menuItem.price,
        },
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          menu_id: menuId,
          quantity,
          unit_price: menuItem.price,
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

module.exports = AddToCartService;
