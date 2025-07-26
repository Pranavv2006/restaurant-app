const express = require('express');
const router = express.Router();

const merchantController = require('./contollers/merchantController');

router.post('/Register', merchantController.registerMerchant);

module.exports = router;