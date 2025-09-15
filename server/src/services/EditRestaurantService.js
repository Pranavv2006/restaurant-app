const prisma = require("../models/prismaClient");

const EditRestaurantService = async (restaurantId, updateData) => {
  try {
    const id = Number(restaurantId);
    if (!id || isNaN(id)) {
      return {
        success: false,
        message: "Invalid restaurant ID",
        data: null,
      };
    }

    const allowedFields = ["name", "location", "phone", "cuisine", "imageUrl"];
    const data = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        data[key] = updateData[key];
      }
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: "Restaurant updated successfully",
      data: {
        name: updatedRestaurant.name,
        location: updatedRestaurant.location,
        phone: updatedRestaurant.phone,
        cuisine: updatedRestaurant.cuisine,
        imageUrl: updatedRestaurant.imageUrl,
      },
    };
  } catch (error) {
    console.error("Error editing restaurant:", error);
    return {
      success: false,
      message: error.message || "Failed to edit restaurant",
      data: null,
    };
  }
};

module.exports = { EditRestaurantService };
