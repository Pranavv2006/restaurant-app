const prisma = require('../models/prismaClient');

const addMenuItem = async (restaurantId, name, description, price, image_url) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: restaurantId
            }
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price,
                image_url,
                restaurant: {
                    connect: {
                        id: restaurantId
                    }
                }
            }
        });

        return {
            status: 'success',
            message: 'Menu item added successfully',
            data: menuItem
        };
    } catch (error) {
        return {
            status: 'fail',
            message: error.message
        };
    }
};

module.exports = { addMenuItem };