// Include Sequelize module.
const { DataTypes } = require('sequelize');

// Import sequelize object, 
// Database connection pool managed by Sequelize.
const database = require('../utils/database');

const User = database.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING(20)
    },
    lastname: {
        type: DataTypes.STRING(20)
    },
    isMale: {
        type: DataTypes.BOOLEAN
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pseudo: {
        type: DataTypes.STRING(20)
    },
    photo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

module.exports = User;