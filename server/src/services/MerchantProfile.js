const prisma = require('../models/prismaClient');

const getMerchantProfile = async (merchantId) => {
    try {
        const profile = await prisma.restaurant.findUnique({
            where: { id: merchantId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                restaurants: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        phone: true,
                        cuisine: true
                    }
                }
            }
        });
        
        if(!profile){
            return {
                status: 'error',
                message: 'Merchant profile not found'
            };
        }
        return {
            status: 'success',
            data: profile
        };
    } catch (error) {
        throw new Error('Error fetching merchant profile');
    }
};

module.exports = { getMerchantProfile };
