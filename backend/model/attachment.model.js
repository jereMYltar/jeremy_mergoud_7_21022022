const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Attachment = database.define('attachement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: false
});

module.exports = Attachment;