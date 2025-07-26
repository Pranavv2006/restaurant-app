const insertMerchant = () => {
    return `
            INSERT INTO merchant (
                merchant_username, 
                merchant_email, 
                merchant_password, 
                merchant_phone, 
                restaurant_name, 
                merchant_location
            ) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
}

const merchantEmailCheck = () => {
    return 'SELECT merchant_email FROM merchant WHERE merchant_email = $1';
}

const merchantUsernameCheck = () => {
    return 'SELECT merchant_username FROM merchant WHERE merchant_username = $1';
}

module.exports = { insertMerchant, merchantEmailCheck, merchantUsernameCheck };