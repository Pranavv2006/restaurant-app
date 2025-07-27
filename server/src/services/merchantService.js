const pool = require('../config/db');
const merchantModel = require('../models/merchantModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (username, email, password, phone, resName, location) => {
    try {
        const emailCheck = await pool.query(
            merchantModel.merchantEmailCheck(),
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return {
                success: false,
                message: 'Email already exists',
                error: 'DUPLICATE_EMAIL'
            };
        }

        const usernameCheck = await pool.query(
            merchantModel.merchantUsernameCheck(),
            [username]
        );
        
        if (usernameCheck.rows.length > 0) {
            return {
                success: false,
                message: 'Username already exists',
                error: 'DUPLICATE_USERNAME'
            };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = merchantModel.insertMerchant();
        const values = [username, email, hashedPassword, phone, resName, location];

        const res = await pool.query(query, values);

        return {
            success: true, 
            data: res.rows[0],
            message: 'Merchant registered successfully'
        };
                
    } catch (error) {
        console.error(`Error registering merchant: ${error.message}`);
        return {
            success: false,
            message: 'Failed to register merchant',
            error: error.message
        };
    }
}

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

module.exports = {register, login};