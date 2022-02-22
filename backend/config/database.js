const env = require('../config/env');
const Sequelize = require('sequelize');

const database = new Sequelize(
    env.DB_NAME,
    env.DB_USERNAME,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        dialect: env.DB_DIALECT
    });

module.exports = database;