const prisma = require('../models/prismaClient');

const addMenuItem = async (restaurantId, name, description, price, image_url) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: restaurantId
            }
        });

        if (!restaurant) {
            return {
                success: false,
                message: 'Restaurant not found'
            };
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
            data: {
                menuItem: {
                    id: menuItem.id,
                    name: menuItem.name,
                    description: menuItem.description,
                    price: menuItem.price,
                    image_url: menuItem.image_url
                }
            }
        };
    } catch (error) {
        console.error(`Error adding menu item: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { addMenuItem };