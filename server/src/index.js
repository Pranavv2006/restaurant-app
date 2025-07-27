const express = require('express');
const path = require('path');
const pool = require('./config/db');

const merchantRoutes = require('./routes/merchantRoutes');
const authenticate = require('./middlewares/authenticate');

require('dotenv').config();

const app = express();
const port = process.env.server_port || 3001;

app.use(express.json())
app.use('/merchant', merchantRoutes);

app.get('/merchant/profile', authenticate, (req, res) => {
    res.json({
        status: 'success',
        message: 'Profile retrieved',
        data: {
            user: req.user
        }
    });
})

app.get('/', async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The Database name is ${result.rows[0].current_database}`);
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});

// use prisma/drizzle for model generation