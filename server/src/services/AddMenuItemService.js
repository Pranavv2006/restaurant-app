const prisma = require("../models/prismaClient");

const addMenuItem = async (
  restaurantId,
  name,
  description,
  price,
  imageUrl,
  category
) => {
  try {
    console.log("💾 Adding menu item with params:", {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
      category,
    });

    if (
      !restaurantId ||
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !category
    ) {
      return {
        success: false,
        error:
          "Missing required fields: restaurantId, name, description, and price are required",
      };
    }

    if (!imageUrl || imageUrl.trim() === "") {
      return {
        success: false,
        error: "Image is required",
      };
    }

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
        imageUrl: imageUrl,
        category: category,
      },
    });

    console.log("✅ Menu item created successfully:", menuItem);

    return {
      success: true,
      message: "Menu item added successfully",
      data: {
        menuItem: menuItem,
      },
    };
  } catch (error) {
    console.error(`❌ Error adding menu item: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { addMenuItem };
