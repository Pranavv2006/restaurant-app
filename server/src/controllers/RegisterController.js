const registerService = require('../services/RegisterService');

const registerController = async (req, res) => {
    try {
        const {email, password, firstName, lastName, role} = req.body;
        const result = await registerService.register(email, password, firstName, lastName, role);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}
module.exports = { registerController };