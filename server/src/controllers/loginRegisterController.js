const registerService = require('../services/RegisterService');
const loginService = require('../services/loginService');

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
        res.status(500).json({ message: error.message });
    }
}

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
        }

        const result = await loginService.login(email, password);

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

module.exports = { registerController, loginController};