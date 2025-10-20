const prisma = require("../models/prismaClient");

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
      throw new Error("customerId and restaurantId are required.");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("At least one item is required to place an order.");
    }

    // ✅ FIXED: Get customer with their default address
    const [customerRecord, restaurantRecord] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
        select: { 
          id: true,
          userId: true,
          addresses: {
            where: {
              isDefault: true
            },
            select: {
              addressLine: true,
              latitude: true,
              longitude: true
            },
            take: 1
          }
        },
      }),
      prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { latitude: true, longitude: true },
      }),
    ]);

    // Debug logging
    console.log('🔍 Customer Record:', JSON.stringify(customerRecord, null, 2));
    console.log('🔍 Restaurant Record:', JSON.stringify(restaurantRecord, null, 2));

    if (!customerRecord) {
      throw new Error("Invalid Customer ID - customer not found.");
    }

    if (!restaurantRecord) {
      throw new Error("Invalid Restaurant ID - restaurant not found.");
    }

    // ✅ FIXED: Check if customer has a default address
    if (!customerRecord.addresses || customerRecord.addresses.length === 0) {
      throw new Error("Customer does not have a default delivery address. Please add an address first.");
    }

    const customerAddress = customerRecord.addresses[0];

    // ✅ FIXED: Get location from the address object
    if (
      !customerAddress.latitude ||
      !customerAddress.longitude ||
      !restaurantRecord.latitude ||
      !restaurantRecord.longitude
    ) {
      throw new Error(
        "Location data (latitude/longitude) is missing for the customer or restaurant."
      );
    }

    const customerLat = parseFloat(customerAddress.latitude);
    const customerLon = parseFloat(customerAddress.longitude);
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

    // ✅ FIXED: Use addressLine from the address object and correct userId
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: customerRecord.userId } },
        restaurant: { connect: { id: restaurantId } },
        total: orderTotal,
        deliveryFee: deliveryFee,
        deliveryAddress: customerAddress.addressLine,

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

    // Clear the customer's cart after successful order placement
    const cart = await prisma.cart.findUnique({
      where: { customerId: customerRecord.id }
    });

    if (cart) {
      // Delete all cart items for this customer
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      console.log(`🗑️ Cart cleared for customer ${customerRecord.id} after order ${order.id}`);
    }

    return {
      success: true,
      message: `Order ${order.id} placed successfully`,
      data: {
        orderId: order.id,
        total: order.total,
        deliveryFee: order.deliveryFee,
        status: order.status,
        orderDate: order.orderDate,
        address: customerAddress.addressLine,
      },
    };
  } catch (error) {
    console.error("PlaceOrderService Error:", error.message);

    return {
      success: false,
      message:
        error.message.includes("Invalid Customer or Restaurant") ||
        error.message.includes("Location data") ||
        error.message.includes("default delivery address")
          ? error.message
          : "An internal error occurred while processing the order.",
      data: null,
    };
  }
};

module.exports = { PlaceOrderService };