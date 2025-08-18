const prisma = require('@prisma/client');

const CheckRestaurantService = async (userId) => {
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
        data: restaurant
    }
};

module.exports = CheckRestaurantService;