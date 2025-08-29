const prisma = require("../models/prismaClient");

const retrieveMerchantMenu = async (restaurantId) => {
  try {
    const id = Number(restaurantId);

    if (!Number.isInteger(id)) {
      return {
        success: false,
        error: "Invalid restaurant id",
      };
    }

    const menuItems = await prisma.menu.findMany({
      where: {
        restaurantId: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
      },
    });

    console.log(`Found ${menuItems.length} menu items for restaurant ${id}`);

    return {
      success: true,
      data: menuItems,
    };
  } catch (error) {
    console.error(`Error retrieving restaurant menu: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { retrieveMerchantMenu };
