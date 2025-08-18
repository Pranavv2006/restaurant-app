const prisma = require('../models/prismaClient');

const removeMenuItem = async (menuItemId) => {
    try {
        const menuItem = await prisma.menu.findUnique({
            where: { id: menuItemId },
            include: {
                restaurant: {
                    select: { id: true, merchantId: true, name: true }
                }
            }
        });

        if (!menuItem) {
            return {
                status: 'fail',
                message: 'Menu item not found'
            };
        }

        const [deletedOrderItemsResult, deletedMenu] = await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { menuId: id } }),
            prisma.menu.delete({ where: { id } })
        ]);

        return {
            status: 'success',
            message: 'Menu item and related order items removed successfully',
            data: {
                deletedMenu: {
                    id: deletedMenu.id,
                    name: deletedMenu.name,
                    restaurantId: deletedMenu.restaurantId
                },
                deletedOrderItemsCount: deletedOrderItemsResult.count ?? deletedOrderItemsResult
            }
        };

        return {
            status: 'success',
            message: 'Menu item removed successfully',
            data: menuItem
        };
    } catch (error) {
        return {
            status: 'fail',
            message: error.message
        };
    }
};

module.exports = { removeMenuItem };