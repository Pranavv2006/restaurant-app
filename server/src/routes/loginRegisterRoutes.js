const express = require('express');
const router = express.Router();

const loginRegisterController = require('../controllers/loginRegisterController');
const forgotPassword = require('../controllers/ForgotPasswordController');

router.post('/register', loginRegisterController.registerController); 
router.post('/login', loginRegisterController.loginController);
router.post('/forgot-password', forgotPassword.ForgotPasswordReset);
module.exports = router;