const prisma = require("../models/prismaClient");

const removeMenuItem = async (menuItemId) => {
  try {
    const id = Number(menuItemId);
    const menuItem = await prisma.menu.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { id: true, merchantId: true, name: true },
        },
      },
    });

    if (!menuItem) {
      return {
        success: false,
        message: "Menu item not found",
      };
    }

    const deletedOrderItemsResult = await prisma.orderItem.deleteMany({
      where: { menuId: id },
    });

    const deletedMenu = await prisma.menu.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Menu item and related order items removed successfully",
      data: {
        deletedMenu: {
          id: deletedMenu.id,
          name: deletedMenu.name,
          restaurantId: deletedMenu.restaurantId,
        },
        deletedOrderItemsCount: deletedOrderItemsResult.count,
      },
    };
  } catch (error) {
    console.error(`Error removing menu item: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { removeMenuItem };
