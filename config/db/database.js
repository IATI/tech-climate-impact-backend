const mongoose = require('mongoose');
const config = require('../config');

const server = `${config.DB_HOST}:${config.DB_PORT}`; // REPLACE WITH YOUR DB SERVER
const database = config.DB_NAME; // REPLACE WITH YOUR DB NAME

class Database {
    constructor() {
        this.connect();
    }

    // eslint-disable-next-line class-methods-use-this
    connect() {
        mongoose
            .connect(`mongodb://${server}/${database}`)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection error', err);
            });
    }
}

module.exports = new Database();
