const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized!',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized!',
        });
    }
};

module.exports = { authenticate };