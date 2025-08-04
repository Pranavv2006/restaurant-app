const express = require('express');
const router = express.Router();

const loginRegisterController = require('../controllers/loginRegisterController'); 

router.post('/register', loginRegisterController.registerController); 
router.post('/login', loginRegisterController.loginController);

module.exports = router;