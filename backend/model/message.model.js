const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Message = database.define('message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: true
});

module.exports = Message;