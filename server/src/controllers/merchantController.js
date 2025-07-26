const merchantService = require('../services/merchantService');

const registerMerchant = async (req, res) => {
    try {
        const {username, email, password, phone, resName, location} = req.body;
        const result = await merchantService.register(username, email, password, phone, resName, location);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
}

module.exports = { registerMerchant };