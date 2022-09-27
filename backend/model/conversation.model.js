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
    conversationAdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }
},
{
    freezeTableName: true,
    timestamp: true
});

module.exports = Conversation;

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant name et conversationAdminId
//- message READ : requêtes brutes ci-dessous
//- message UPDATE : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id du message modifié (pour la clause WHERE)

//READ toutes les conversations auxquelles participe un utilisateur (sur la base de son id)
module.exports.findAllByUserId = function (userId) {
    return database.query(`SELECT DISTINCT conversation.id, conversation.name FROM conversation JOIN user_conversation ON user_conversation.conversation_id = conversation.id WHERE user_conversation.user_id = ${userId} ORDER BY conversation.name ASC;`, { type: QueryTypes.SELECT });
};