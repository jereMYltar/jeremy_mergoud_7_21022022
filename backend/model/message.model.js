const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');

//définition du modèle correspondant à la table éponyme de la base de donnée
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
    messageOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isModerated: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    isGlobal: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
},
{
    freezeTableName: true,
    timestamps: true
});

module.exports = Message;

//définition des fonctions de base du modèle :
//- CREATE - créer un message : requête de base de Sequelize => create. Requiert un objet contenant conversation_id, messageOwnerId et content
//- READ - lire/récupérer un message : requêtes brutes ci-dessous
//- UPDATE - mettre à jour un message : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- DELETE - supprimer un message : requête de base de Sequelize => destroy. Requiert l'id du message supprimé (pour la clause WHERE)

//READ : récupérer un message par son id :
module.exports.findOneById = function (messageId) {
    return database.query(`
    SELECT message.id AS id,
        CONCAT(user.firstName, ' ', user.lastName) AS 'author',
        message.content AS 'content',
        message.createdAt AS createdAt,
        message.updatedAt AS updatedAt,
        message.isModerated as isModerated,
        message.messageOwnerId AS messageOwnerId
    FROM message
    JOIN user ON message.messageOwnerId=user.id
    WHERE message.id=${messageId} ;
    `, { type: QueryTypes.SELECT });
};
//READ : récupérer tous les messages d'une conversation par l'id de celle-ci
module.exports.findAllByConversationId = function (conversationId) {
    return database.query(`
    SELECT message.id AS id,
        CONCAT(user.firstName, ' ', user.lastName) AS 'author',
        message.content AS 'content',
        message.createdAt AS createdAt,
        message.updatedAt AS updatedAt,
        message.isModerated as isModerated,
        message.messageOwnerId AS messageOwnerId
    FROM message
    JOIN user ON message.messageOwnerId=user.id
    WHERE message.conversation_id=${conversationId}
    ORDER BY createdAt DESC;
    `, { type: QueryTypes.SELECT });
};
//READ : récupérer tous les messages actifs (non modérés) d'une conversation par l'id de celle-ci
module.exports.findAllActiveByConversationId = function (conversationId) {
    return database.query(`
    SELECT message.id AS id,
        CONCAT(user.firstName, ' ', user.lastName) AS 'author',
        message.content AS 'content',
        message.createdAt AS createdAt,
        message.updatedAt AS updatedAt,
        message.isModerated as isModerated,
        message.messageOwnerId AS messageOwnerId
    FROM message
    JOIN user ON message.messageOwnerId=user.id
    WHERE message.conversation_id=${conversationId} AND !message.isModerated;
    `, { type: QueryTypes.SELECT });
};
//READ : récupérer le dernier message d'une conversation
module.exports.findLatestByConversationId = function (conversationId) {
    return database.query(`
    SELECT message.id AS id,
        CONCAT(user.firstName, ' ', user.lastName) AS 'author',
        message.content AS 'content',
        message.createdAt AS createdAt,
        message.updatedAt AS updatedAt,
        message.isModerated as isModerated,
        message.messageOwnerId AS messageOwnerId
    FROM message
    JOIN user ON message.messageOwnerId=user.id
    WHERE message.conversation_id=${conversationId}
    ORDER BY message.id DESC LIMIT 0,1 ;
    `, { type: QueryTypes.SELECT });
};