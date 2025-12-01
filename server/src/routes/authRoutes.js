const express = require('express');
const router = express.Router();
const { refreshToken, logout, logoutAll } = require('../controllers/refreshToken');
const { authenticate } = require('../middlewares/authenticate');

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAll);

module.exports = router;