const express = require('express');
const cors = require('cors');
const path = require('path');

const loginRegisterRoutes = require('./routes/loginRegisterRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const {authenticate} = require('./middlewares/authenticate'); // ✅ Import both
const prisma = require('./models/prismaClient'); 
const rateLimit = require('express-rate-limit')

require('dotenv').config();

const app = express();
const port = process.env.server_port || 3000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000', 
        'http://localhost:4173'   
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

const limiter = rateLimit({
    max: 100,
    windowMs: 10 * 60 * 1000,
    message: "Too many Requests, please try again after 10 minutes"
})

const openPaths = ['/login', '/register'];
const jwtGuard = (req, res, next) => {
  if (openPaths.includes(req.path)) return next();
  return authenticate(req, res, next);
};

app.use('/Restaurant', limiter, jwtGuard, loginRegisterRoutes);

app.use('/Restaurant/Merchant', authenticate, merchantRoutes);

app.get('/', async (req, res) => {
    const result = await prisma.$queryRaw`SELECT current_database()`;
    res.send(`The Database name is ${result[0].current_database}`);
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});

// use prisma/drizzle for model generation
// rate limiting for register and login(cache-based/redis based)