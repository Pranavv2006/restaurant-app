const {Client} = require('pg');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '..', '.env')});

const client = new Client({
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database_name,
    host: process.env.database_host,
    port: parseInt(process.env.database_port)
});

client.connect()
    .then(() => console.log('Connected'))
    .catch(error => console.error(error.stack));

module.exports = client;