const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');
const Conversation = require('./conversation.model');
const User = require('./user.model');

//définition du modèle correspondant à la table éponyme de la base de donnée
const UserConversation = database.define(
    'user_conversation', 
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        conversation_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Conversation,
                key: 'id'
            }
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

User.belongsToMany(
    Conversation,
    {
        through: UserConversation,
        foreignKey: "user_id"
    });
Conversation.belongsToMany(
    User,
    {
        through: UserConversation,
        foreignKey: "conversation_id"
    });

module.exports = UserConversation;

//définition des fonctions de base du modèle :
//- CREATE - créer une relation : requête de base de Sequelize => create. Requiert un objet contenant user_id et conversation_id
//- READ - lire/récupérer une relation utilisateur-conversation : requête brute ci-dessous
//- DELETE - supprimer toutes les relations d'une conversation : requête de base de Sequelize => destroy. Requiert l'id de la conversation supprimée (pour la clause WHERE)

//READ : récupérer toutes les membres d'une conversation (sur la base de son id)
module.exports.findAllMembersByConversationId = function (conversationId) {
    return database.query(`
        SELECT
            user_conversation.user_id AS id,
            CONCAT(user.firstName, ' ', user.lastName) AS name
        FROM user_conversation
        JOIN user ON user.id = user_conversation.user_id
        WHERE conversation_id = ${conversationId}
        ORDER BY name ASC
    `, { type: QueryTypes.SELECT });
};