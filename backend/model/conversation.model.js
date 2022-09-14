const { DataTypes, QueryTypes } = require('sequelize');
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

//Renvoie les message d'une conversation
module.exports.findConversation = function (id) {
    return database.query(`SELECT message.id AS id, CONCAT(user.firstName, ' ', user.lastName) AS 'auteur', message.content AS 'contenu', message.createdAt AS timestamp, message.updatedAt AS lastUpdate FROM message JOIN user ON message.user_id=user.id WHERE message.conversation_id=${id} ORDER BY Message.createdAt DESC;`, { type: QueryTypes.SELECT });
};

//changer findConversationsForUser
module.exports.findConversations = function (userId) {
    return database.query(`SELECT DISTINCT conversation.id, conversation.name FROM conversation JOIN user_conversation ON user_conversation.conversation_id = conversation.id WHERE user_conversation.user_id = ${userId} ORDER BY conversation.name ASC;`, { type: QueryTypes.SELECT });
};