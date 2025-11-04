const prisma = require("../models/prismaClient");

const GetCustomerOrdersService = async (userId) => {
  try {

    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        data: null,
      };
    }

    const userIdInt = parseInt(userId);

    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        customers: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    if (!user.customers || user.customers.length === 0) {
      return {
        success: false,
        message: "Customer profile not found for this user",
        data: null,
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userIdInt,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
            phone: true,
            cuisine: true,
            imageUrl: true
          }
        },
        items: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                category: true
              }
            }
          }
        },
        payments: {
          select: {
            id: true,
            transactionNo: true,
            modeOfPayment: true,
            status: true,
            date: true
          }
        }
      },
      orderBy: {
        orderDate: "desc"
      }
    });

    const transformedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      status: order.status,
      discount: parseFloat(order.discount.toString()),
      total: parseFloat(order.total.toString()),
      deliveryFee: parseFloat(order.deliveryFee.toString()),
      orderDate: order.orderDate,
      deliveryTime: order.deliveryTime,
      deliveryAddress: order.deliveryAddress,
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name,
        location: order.restaurant.location,
        phone: order.restaurant.phone,
        cuisine: order.restaurant.cuisine,
        imageUrl: order.restaurant.imageUrl
      },
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        menuId: item.menuId,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
        menu: {
          id: item.menu.id,
          name: item.menu.name,
          description: item.menu.description,
          price: parseFloat(item.menu.price.toString()),
          imageUrl: item.menu.imageUrl,
          category: item.menu.category
        }
      })),
      payments: order.payments.map(payment => ({
        id: payment.id,
        transactionNo: payment.transactionNo,
        modeOfPayment: payment.modeOfPayment,
        status: payment.status,
        date: payment.date
      }))
    }));

    return {
      success: true,
      message: `Found ${orders.length} orders for the customer`,
      data: transformedOrders,
    };

  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching customer orders",
      data: null,
    };
  }
};

module.exports = { GetCustomerOrdersService };
