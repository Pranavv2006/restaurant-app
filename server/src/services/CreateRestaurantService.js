const prisma = require('../models/prismaClient');

const createRestaurant = async (merchantId, name, location, phone, cuisine) => {
    try{
        const merchant = await prisma.user.findFirst({
            where: {
                id: merchantId,
                userRoles: {
                    some: {
                        role: {
                            type: 'Merchant'
                        }
                    }
                }
            }
        });

        if (!merchant) {
            throw new Error('Merchant not found');
        }

        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                location,
                phone,
                cuisine,
                merchant: {
                    connect: {
                        id: merchantId
                    }
                }
            }
        });

        return {
            success: true,
            message: 'Restaurant created successfully',
            data: {
                restaurant: {
                    id: restaurant.id,
                    name: restaurant.name,
                    location: restaurant.location,
                    phone: restaurant.phone,
                    cuisine: restaurant.cuisine
                }
            }
        };
    } catch (error) {
        console.error(`Error creating restaurant: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { createRestaurant };