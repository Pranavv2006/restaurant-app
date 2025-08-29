const prisma = require("../models/prismaClient");

const addMenuItem = async (
  restaurantId,
  name,
  description,
  price,
  imageUrl
) => {
  try {
    console.log("Adding menu item with params:", {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
    });

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
    });

    if (!restaurant) {
      return {
        success: false,
        error: "Restaurant not found",
      };
    }

    const menuItem = await prisma.menu.create({
      data: {
        restaurantId: restaurantId,
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl || "",
      },
    });

    console.log("Menu item created successfully:", menuItem);

    return {
      success: true,
      message: "Menu item added successfully",
      data: {
        menuItem: menuItem,
      },
    };
  } catch (error) {
    console.error(`Error adding menu item: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { addMenuItem };
