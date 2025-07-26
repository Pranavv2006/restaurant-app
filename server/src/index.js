const express = require('express');
const path = require('path');
const pool = require('./config/db');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.server_port || 3001;

app.use(express.json())

app.get('/', async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The Database name is ${result.rows[0].current_database}`);
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});