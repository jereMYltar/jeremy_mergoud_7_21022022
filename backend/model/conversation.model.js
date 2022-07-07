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

module.exports.findConversation = function (id) {
    return database.query(`SELECT CONCAT(user.firstName, ' ', user.lastName) AS 'auteur', message.content AS 'contenu', message.createdAt AS timestamp FROM message JOIN user ON message.user_id=user.id WHERE message.conversation_id=${id} ORDER BY Message.createdAt DESC;`, { type: QueryTypes.SELECT });
};

//changer findConversationsForUser
module.exports.findConversations = function (userId) {
    return database.query(`SELECT DISTINCT conversation.id, conversation.name FROM conversation JOIN message ON conversation.id=message.conversation_id WHERE message.user_id=${userId} ORDER BY Conversation.name ASC;`, { type: QueryTypes.SELECT });
};