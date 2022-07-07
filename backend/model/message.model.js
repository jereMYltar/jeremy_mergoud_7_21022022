const { DataTypes, QueryTypes } = require('sequelize');
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

module.exports.findMessage = function (id) {
    return database.query(`SELECT CONCAT(user.firstName, ' ', user.lastName) AS 'auteur', message.content AS 'contenu', message.createdAt AS firstTimestamp, message.updatedAt AS lastTimestamp FROM message JOIN user ON message.user_id=user.id WHERE message.id=${id} ;`, { type: QueryTypes.SELECT });
};