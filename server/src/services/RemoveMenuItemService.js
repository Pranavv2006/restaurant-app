const prisma = require('../models/prismaClient');

const removeMenuItem = async (menuItemId) => {
    try {
        const menuItem = await prisma.menu.findUnique({
            where: {
                id: menuItemId
            },
            include: {
                restaurant: {
                    select: {
                        id: true,
                        merchantId: true,
                        name: true
                    }
                },
                items: {
                    select: {
                        id: true,
                        orderId: true
                    }
                }
            }
        });

        if (!menuItem) {
            return {
                status: 'fail',
                message: 'Menu item not found'
            };
        }


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