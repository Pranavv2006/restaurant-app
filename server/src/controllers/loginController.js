const loginService = require('../services/loginService');

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        const result = await loginService.login(email, password);

        if (result.success){
            res.status(200).json(result);
        }else{
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { loginController };