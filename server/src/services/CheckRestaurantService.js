const prisma = require('@prisma/client');

const CheckRestaurantService = async (userId) => {
    try {
        const restaurant = await prisma.users.findUnique({
            where: { merchantId: userId },
            select: {
                id: true,
                name: true,
                location: true,
                phone: true,
                cuisine: true
            }
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        return {
            status: 'success',
            message: 'Restaurant found',
            data: {
                restaurant: {
                    id: restaurant.id,
                    name: restaurant.name,
                    location: restaurant.location,
                    phone: restaurant.phone,
                    cuisine: restaurant.cuisine
                }
            }
        }
    } catch (error) {
        console.error(`Error checking restaurant: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {CheckRestaurantService};