const {Pool, Client} = require('pg');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const pool = new Pool({
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database_name,
    host: process.env.database_host,
    port: parseInt(process.env.database_port)
});

pool.on('error', (err) => {
    console.error(`Pool error: ${err}`);
});

pool.on('connect', () => {
    console.log('New connection established');
});

pool.on('remove', () => {
    console.log('Connection removed');
})

module.exports = pool;