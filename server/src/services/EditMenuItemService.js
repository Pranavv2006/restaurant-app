const { restaurant } = require("../models/prismaClient");
const prisma = require("../utils/prismaClient");

const editMenuItem = async (menuItemId, name, description, price, imageUrl) => {
  try {
    const menuItem = await prisma.menu.findUnique({
      where: {
        id: menuItemId,
      },
    });

    if (!menuItem) {
      return {
        success: false,
        message: "Menu item not found",
      };
    }

    const updatedMenuItem = await prisma.menu.update({
      where: {
        id: menuItemId,
      },
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });

    return {
      success: true,
      data: {
        id: updatedMenuItem.id,
        name: updatedMenuItem.name,
        description: updatedMenuItem.description,
        price: updatedMenuItem.price,
        imageUrl: updatedMenuItem.imageUrl,
      },
    };
  } catch (error) {
    console.error(`Error updating menu item: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { editMenuItem };
