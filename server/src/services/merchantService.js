const pool = require('./config/db');
const merchantModel = require('./models/merchantModel');

const register = async (username, email, password, phone, resName, location) => {
    try {
        const query = merchantModel.insertMerchant();
        const values = [username, email, password, phone, resName, location];

        const res = await pool.query(text, values);
        
        return {
            success: true, 
            data: res.rows[0],
            message: 'Merchant registered successfully'
        };
    } catch (error) {
        console.error(`Error registering mechant: ${error.message}`);
    }
}

const login = async (username, email) => {
    
}

module.export = {register};