const express = require('express');
const path = require('path');
const pool = require('./config/db');

const merchantRegister = require('./routes/merchants/merchantRegister');

require('dotenv').config();

const app = express();
const port = process.env.server_port || 3001;

app.use(express.json())
app.use('/merchant', merchantRegister);

app.get('/', async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The Database name is ${result.rows[0].current_database}`);
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});