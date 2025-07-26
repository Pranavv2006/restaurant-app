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