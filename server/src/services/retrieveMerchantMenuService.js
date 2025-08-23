const prisma = require('../models/prismaClient');

const retrieveMerchantMenu = async (restaurantId) => {
    try{
        const id = Number(restaurantId);

        if (!Number.isInteger(id)) {
            return { 
                success: false, 
                error: 'Invalid restaurant id' 
            };
        }

        const menu = await prisma.menu.findMany({
            where: {
                restaurantId: id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true
            }
        });

        if (menu.length === 0) {
            return {
                success: false,
                error: 'No menu items found for this restaurant.'
            };
        }

        return {
            success: true,
            data: menu
        };
    } catch (error) {
        console.error(`Error retrieving restaurant menu: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { retrieveMerchantMenu };