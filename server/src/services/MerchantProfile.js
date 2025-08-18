const prisma = require('../models/prismaClient');

const getMerchantProfile = async (merchantId) => {
    try {
        const profile = await prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        return profile;
    } catch (error) {
        throw new Error('Error fetching merchant profile');
    }
};

module.exports = {
    getMerchantProfile,
};
