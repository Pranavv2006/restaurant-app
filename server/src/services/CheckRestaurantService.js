const prisma = require('../models/prismaClient');

const checkRestaurantService = async (merchantId) => {
    try {
        if (!merchantId) {
            return {
                success: false,
                message: 'Merchant ID is required',
                hasRestaurant: false
            };
        }

        const merchantIdNum = Number(merchantId);
        if (!Number.isInteger(merchantIdNum)) {
            return {
                success: false,
                message: 'Invalid merchant ID format',
                hasRestaurant: false
            };
        }

        const userWithRoles = await prisma.user.findUnique({
            where: { id: merchantIdNum },
            include: {
                userRoles: {
                    where: { status: true },
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!userWithRoles) {
            return {
                success: false,
                message: 'User not found',
                hasRestaurant: false
            };
        }

        const isMerchant = userWithRoles.userRoles.some(
            userRole => userRole.role.type.toLowerCase() === 'merchant'
        );

        if (!isMerchant) {
            return {
                success: false,
                message: 'User is not a merchant',
                hasRestaurant: false
            };
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { merchantId: merchantIdNum },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (restaurant) {
            return {
                success: true,
                message: 'Restaurant found',
                hasRestaurant: true,
                data: {
                    id: restaurant.id,
                    name: restaurant.name,
                    location: restaurant.location,
                    phone: restaurant.phone,
                    cuisine: restaurant.cuisine,
                    merchant: restaurant.user
                }
            };
        } else {
            return {
                success: true,
                message: 'No restaurant found for this merchant',
                hasRestaurant: false,
                data: null
            };
        }

    } catch (error) {
        console.error('Error checking restaurant:', error);
        return {
            success: false,
            message: 'Failed to check restaurant',
            hasRestaurant: false,
            error: error.message
        };
    }
};

module.exports = { checkRestaurantService };