const primsa = require('../models/prismaClient');

const removeMenuItem = async (menuItemId) => {
    try {
        const menuItem = await prisma.menuItem.delete({
            where: {
                id: menuItemId
            }
        });

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