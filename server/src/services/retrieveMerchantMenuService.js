const prisma = require("../models/prismaClient");
const path = require("path");
const fs = require("fs");

const retrieveMerchantMenu = async (restaurantId) => {
  try {
    console.log("Fetching menu for restaurant ID:", restaurantId);

    const menuItems = await prisma.menu.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
      },
      include: {
        restaurant: true,
      },
    });

    console.log("Found menu items:", menuItems.length);

    menuItems.forEach((item) => {
      if (item.imageUrl) {
        const fullPath = path.join(__dirname, "../", item.imageUrl);
        console.log(`Item: ${item.name}`);
        console.log(`Image URL: ${item.imageUrl}`);
        console.log(`Full path: ${fullPath}`);
        console.log(`File exists: ${fs.existsSync(fullPath)}`);
        console.log("---");
      }
    });

    return {
      success: true,
      data: menuItems,
    };
  } catch (error) {
    console.error("Error retrieving menu:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { retrieveMerchantMenu };
