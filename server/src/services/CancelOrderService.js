const prisma = require("../models/prismaClient");

const CancelOrderService = async ({orderId}) => {
    try{
        if(!orderId){
            return { success: false, message: "Customer or Order Id not found" };
        }

        const orderIdInt = parseInt(orderId);
        if (isNaN(orderIdInt)) {
            return { 
                success: false, 
                message: "Invalid order ID format" 
            };
        }

        const existingOrder = await prisma.order.findUnique({
            where: {
                id: orderIdInt
            },
            include: {
                user: {
                    include: {
                        customers: true
                    }
                },
                restaurant: {
                    select: {
                        name: true
                    }
                },
                items: {
                    include: {
                        menu: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        if (!existingOrder) {
            return {
                success: false,
                message: "Order not found"
            }
        }

        const cancellableStatuses = ['pending', 'confirmed', 'preparing'];
        if (!cancellableStatuses.includes(existingOrder.status.toLowerCase())) {
            return { 
                success: false, 
                message: `Cannot cancel order. Current status: ${existingOrder.status}. Orders can only be cancelled when status is pending, confirmed, or preparing.` 
            };
        }

        const cancelledOrder = await prisma.order.update({
            where: {
                id: orderIdInt,
            },
            data: {
                status: 'Cancelled'
            },
            include: {
                restaurant: {
                    select: {
                        name: true
                    }
                },
                items: {
                    include:{
                        menu:{
                            select:{
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        return{
            success: true,
            message: "Order successfully cancelled",
            data: {
                orderId: cancelledOrder.id,
                status: cancelledOrder.status,
                restaurant: cancelledOrder.restaurant.name,
                total: cancelledOrder.total,
                orderDate: cancelledOrder.orderDate,
                items: cancelledOrder.items.map(item => ({
                    name: item.menu.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal
                }))
            }
        };

    } catch (error) {
        return { success: false, message: "Error deleting order" };
    }
}

module.exports = { CancelOrderService };