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

const loginMerchant = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
        }

        const result = await merchantService.login(email, password);

        if (result.status === 'success'){
            res.status(200).json(result);
        }else{
            res.status(result.statusCode || 400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        });
    }
}

module.exports = { registerMerchant, loginMerchant};