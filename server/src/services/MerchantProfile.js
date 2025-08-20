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
                        name: true
                    }
                }
            }
        });
        
        if(!profile){
            return {
                success: false,
                message: 'Merchant profile not found'
            };
        }
        return {
            status: 'success',
            message: 'Merchant profile retrieved successfully',
            data: {
                profile: {
                    id: profile.id,
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    restaurant: profile.restaurants[1]
                }
            },
        };
    } catch (error) {
        console.error(`Error retrieving merchant profile: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { getMerchantProfile };
