const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');

//définition du modèle correspondant à la table éponyme de la base de donnée
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
//- CREATE - créer une conversation : requête de base de Sequelize => create. Requiert un objet contenant name et conversationAdminId
//- READ - lire/récupérer une conversation : requêtes brutes ci-dessous
//- UPDATE - mettre à jour une conversation : requête de base de Sequelize => update. Requiert un objet contenant name et conversationAdminId, ainsi que l'id de la convesation modifié (pour la clause WHERE)
//- DELETE - supprimer une conversation : requête de base de Sequelize => destroy. Requiert l'id de la conversation supprimée (pour la clause WHERE)

//READ : récupérer toutes les conversations auxquelles participe un utilisateur (sur la base de son id)
module.exports.findAllByUserId = function (userId) {
    return database.query(`
    SELECT DISTINCT conversation.id, conversation.name
    FROM conversation
    JOIN user_conversation ON user_conversation.conversation_id = conversation.id
    WHERE user_conversation.user_id = ${userId}
    ORDER BY conversation.updatedAt DESC;
    `, { type: QueryTypes.SELECT });
};