const jwt = require('jsonwebtoken');  
const prisma = require('../models/prismaClient');
const bcrypt = require('bcrypt');

const login = async (email, password) => {
    try {
        const validate = await pool.query(
            'SELECT * FROM merchant WHERE merchant_email = $1', 
            [email]
        );

        if (validate.rows.length === 0) {
            const err = new Error('Merchant Not Found!');
            err.status = 400;
            throw err;
        }

        const merchant = validate.rows[0];

        if (await bcrypt.compare(password, merchant.merchant_password)) {
            const tokenPayload = {
                merchantId: merchant.merchant_id,
                email: merchant.merchant_email,
                username: merchant.merchant_username,
                restaurantName: merchant.restaurant_name
            };

            const accessToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

            return {
                status: 'success',
                message: 'Merchant Logged In!',
                data: {
                    accessToken,
                    merchant: {
                        id: merchant.merchant_id,
                        username: merchant.merchant_username,
                        email: merchant.merchant_email,
                        restaurantName: merchant.restaurant_name,
                        location: merchant.merchant_location
                    }
                }
            };
        } else {
            const err = new Error('Wrong Password!');
            err.status = 400;
            throw err;
        }
    } catch (err) {
        return {
            status: 'fail',
            message: err.message,
            statusCode: err.status || 500
        };
    }
}