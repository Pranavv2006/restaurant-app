const express = require('express');
const path = require('path');

const loginRegisterRoutes = require('./routes/loginRegisterRoutes');
const authenticate = require('./middlewares/authenticate');
const prisma = require('./models/prismaClient'); 
const rateLimit = require('express-rate-limit')

require('dotenv').config();

const app = express();
const port = process.env.server_port || 3001;

app.use(express.json())

const limiter = rateLimit({
    max: 5,
    windowMs: 10 * 60 * 1000,
    message: "Too many Requests, please try again after 10 minutes"
})

app.use('/Restaurant',limiter, loginRegisterRoutes);

app.get('/Restaurant/profile', authenticate, (req, res) => {
    res.json({
        status: 'success',
        message: 'Profile retrieved',
        data: {
            user: req.user
        }
    });
})

app.get('/', async (req, res) => {
    const result = await prisma.$queryRaw`SELECT current_database()`;
    res.send(`The Database name is ${result[0].current_database}`);
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});

// use prisma/drizzle for model generation
// rate limiting for register and login(cache-based/redis based)