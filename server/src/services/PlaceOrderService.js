const prisma = require("../models/prismaClient");

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1 (degrees).
 * @param {number} lon1 - Longitude of point 1 (degrees).
 * @param {number} lat2 - Latitude of point 2 (degrees).
 * @param {number} lon2 - Longitude of point 2 (degrees).
 * @returns {number} Distance in kilometers (km).
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

/**
 * Calculates the delivery fee based on distance. (Example Logic)
 * @param {number} distanceKm - Distance in kilometers.
 * @returns {number} The calculated delivery fee.
 */
const calculateDeliveryFee = (distanceKm) => {
  const BASE_FEE = 5.0;
  const FEE_PER_KM = 2.5;
  const FREE_DISTANCE = 1.0;

  if (distanceKm <= FREE_DISTANCE) {
    return BASE_FEE;
  }

  const billableDistance = distanceKm - FREE_DISTANCE;
  return BASE_FEE + billableDistance * FEE_PER_KM;
};

const PlaceOrderService = async ({ customerId, restaurantId, items }) => {
  try {
    if (!customerId || !restaurantId) {
      throw new Error("customerId (User ID) and restaurantId are required.");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("At least one item is required to place an order.");
    }

    const [customerRecord, restaurantRecord] = await Promise.all([
      prisma.customer.findUnique({
        where: { userId: customerId },
        select: { latitude: true, longitude: true, address: true },
      }),
      prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { latitude: true, longitude: true },
      }),
    ]);

    if (!customerRecord || !restaurantRecord) {
      throw new Error("Invalid Customer or Restaurant ID.");
    }
    if (
      !customerRecord.latitude ||
      !customerRecord.longitude ||
      !restaurantRecord.latitude ||
      !restaurantRecord.longitude
    ) {
      throw new Error(
        "Location data (latitude/longitude) is missing for the customer or restaurant."
      );
    }

    const customerLat = parseFloat(customerRecord.latitude);
    const customerLon = parseFloat(customerRecord.longitude);
    const restaurantLat = parseFloat(restaurantRecord.latitude);
    const restaurantLon = parseFloat(restaurantRecord.longitude);

    const distanceKm = calculateDistance(
      customerLat,
      customerLon,
      restaurantLat,
      restaurantLon
    );
    const deliveryFee = calculateDeliveryFee(distanceKm);

    const itemIds = items.map((item) => item.id);

    const menuItems = await prisma.menu.findMany({
      where: { id: { in: itemIds }, restaurantId: restaurantId },
      select: { id: true, price: true },
    });

    if (menuItems.length !== itemIds.length) {
      throw new Error(
        "One or more food items are invalid or don't belong to the restaurant."
      );
    }

    let itemsTotal = 0;
    const itemsForOrderCreate = [];

    for (const item of items) {
      const menuItem = menuItems.find((m) => m.id === item.id);

      const unitPrice = parseFloat(menuItem.price);
      const quantity = item.quantity;
      const subtotal = unitPrice * quantity;

      itemsTotal += subtotal;

      itemsForOrderCreate.push({
        menu: { connect: { id: item.id } },
        quantity: quantity,
        unitPrice: unitPrice,
        subtotal: subtotal,
      });
    }

    const orderTotal = itemsTotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: customerId } },
        restaurant: { connect: { id: restaurantId } },
        total: orderTotal,
        deliveryFee: deliveryFee,
        deliveryAddress: customerRecord.address,

        items: {
          create: itemsForOrderCreate,
        },
      },
      select: {
        id: true,
        total: true,
        status: true,
        deliveryFee: true,
        orderDate: true,
      },
    });

    return {
      success: true,
      message: `Order ${order.id} placed successfully`,
      data: {
        orderId: order.id,
        total: order.total,
        deliveryFee: order.deliveryFee,
        status: order.status,
        orderDate: order.orderDate,
        address: customerRecord.address,
      },
    };
  } catch (error) {
    console.error("PlaceOrderService Error:", error.message);

    return {
      success: false,
      message:
        error.message.includes("Invalid Customer or Restaurant") ||
        error.message.includes("Location data")
          ? error.message
          : "An internal error occurred while processing the order.",
      data: null,
    };
  }
};

module.exports = { PlaceOrderService };
