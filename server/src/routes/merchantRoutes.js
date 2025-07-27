const express = require('express');
const router = express.Router();

const merchantController = require('../controllers/merchantController'); 

router.post('/register', merchantController.registerMerchant); 
router.post('/login', merchantController.loginMerchant);

module.exports = router;