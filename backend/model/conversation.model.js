const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Conversation = database.define('conversation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamp: true
});

module.exports = Conversation;