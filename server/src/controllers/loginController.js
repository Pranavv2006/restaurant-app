const loginService = require('../services/loginService');

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await loginService.login(email, password);

        if (result.success){
            res.status(200).json(result);
        }else{
            res.status(result.statusCode || 400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { loginController };