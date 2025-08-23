const prisma = require('../models/prismaClient');

const getMerchantProfile = async (merchantId) => {
    try {
        const id = Number(merchantId);
        if (!Number.isInteger(id)) {
            return { success: false, error: 'Invalid merchant id' };
        }

        const profile = await prisma.user.findUnique({
            where: { id },
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
        
        if (!profile) {
            return {
                success: false,
                message: 'Merchant profile not found'
            };
        }

        return {
            success: true,
            message: 'Merchant profile retrieved successfully',
            data: {
                id: profile.id,
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                restaurants: profile.restaurants
            }
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
