require('dotenv').config();
const { version } = require('../package.json');

module.exports = {
    APP_NAME: 'IATI TCI Backend',
    VERSION: version,
    NODE_ENV: process.env.NODE_ENV,
    NS_PER_SEC: 1e9,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_USER: process.env.DB_USER,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
};
