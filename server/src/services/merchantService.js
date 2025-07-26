const pool = require('../config/db');
const merchantModel = require('../models/merchantModel');

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

        const query = merchantModel.insertMerchant();
        const values = [username, email, password, phone, resName, location];

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

module.exports = {register};