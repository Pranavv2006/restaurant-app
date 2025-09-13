const prisma = require("../models/prismaClient");

const createRestaurant = async (restaurantData) => {
  try {
    const { name, location, phone, cuisine, merchantId, imageUrl } =
      restaurantData;

    if (!name || !location || !phone || !cuisine || !merchantId) {
      return {
        success: false,
        message: "All fields are required",
        error: "Missing required fields",
      };
    }

    const merchantIdNum = Number(merchantId);
    if (!Number.isInteger(merchantIdNum)) {
      return {
        success: false,
        message: "Invalid merchant ID",
        error: "Merchant ID must be a valid number",
      };
    }

    const userWithRoles = await prisma.user.findUnique({
      where: { id: merchantIdNum },
      include: {
        userRoles: {
          where: { status: true },
          include: {
            role: true,
          },
        },
      },
    });

    if (!userWithRoles) {
      return {
        success: false,
        message: "User not found",
        error: "Invalid merchant ID",
      };
    }

    // ✅ Check if user has merchant role
    const isMerchant = userWithRoles.userRoles.some(
      (userRole) => userRole.role.type.toLowerCase() === "merchant"
    );

    if (!isMerchant) {
      return {
        success: false,
        message: "User is not a merchant",
        error: "Only merchants can create restaurants",
      };
    }

    // ✅ Create restaurant according to your schema
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        phone,
        cuisine,
        merchantId: merchantIdNum,
        imageUrl, // Save image URL
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Restaurant created successfully",
      data: {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          location: restaurant.location,
          phone: restaurant.phone,
          cuisine: restaurant.cuisine,
          merchantId: restaurant.merchantId,
          merchant: restaurant.user,
        },
      },
    };
  } catch (error) {
    console.error("Error creating restaurant:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Restaurant with this information already exists",
        error: "Duplicate restaurant data",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Merchant not found",
        error: "Invalid merchant reference",
      };
    }

    return {
      success: false,
      message: "Failed to create restaurant",
      error: error.message,
    };
  }
};

module.exports = { createRestaurant };
