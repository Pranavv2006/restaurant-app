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
            status: 'success',
            message: 'Restaurant created successfully',
            data: restaurant
        };
    } catch (error) {
        return {
            status: 'fail',
            message: error.message
        };
    }
}

module.exports = { createRestaurant };