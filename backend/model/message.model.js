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
    user_id: {
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
    }
},
{
    freezeTableName: true,
    timestamps: true
});

module.exports = Message;

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant conversation_id, user_id et content
//- message READ : requêtes brutes ci-dessous
//- message UPDATE : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id du message modifié (pour la clause WHERE)

//READ un message par son id :
module.exports.findById = function (id) {
    return database.query(`SELECT message.id AS id, CONCAT(user.firstName, ' ', user.lastName) AS 'author', message.content AS 'content', message.createdAt AS createdAt, message.updatedAt AS updatedAt, message.isModerated as isModerated FROM message JOIN user ON message.user_id=user.id WHERE message.id=${id} ;`, { type: QueryTypes.SELECT });
};
//READ tous les messages d'une conversation par l'id de celle-ci
module.exports.findAllByConversationId = function (id) {
    return database.query(`SELECT message.id AS id, CONCAT(user.firstName, ' ', user.lastName) AS 'author', message.content AS 'content', message.createdAt AS createdAt, message.updatedAt AS updatedAt, message.isModerated as isModerated FROM message JOIN user ON message.user_id=user.id WHERE message.conversation_id=${id} ORDER BY createdAt DESC;`, { type: QueryTypes.SELECT });
};
//READ tous les messages actifs (non modérés) d'une conversation par l'id de celle-ci
module.exports.findAllActiveByConversationId = function (id) {
    return database.query(`SELECT message.id AS id, CONCAT(user.firstName, ' ', user.lastName) AS 'author', message.content AS 'content', message.createdAt AS createdAt, message.updatedAt AS updatedAt, message.isModerated as isModerated FROM message JOIN user ON message.user_id=user.id WHERE message.conversation_id=${id} AND message.isModerated = 0;`, { type: QueryTypes.SELECT });
};
//READ le dernier message d'une conversation
module.exports.findLatestByConversationId = function (id) {
    return database.query(`SELECT message.id AS id, CONCAT(user.firstName, ' ', user.lastName) AS 'author', message.content AS 'content', message.createdAt AS createdAt, message.updatedAt AS updatedAt, message.isModerated as isModerated FROM message JOIN user ON message.user_id=user.id WHERE message.conversation_id=${id} ORDER BY message.id DESC LIMIT 0,1 ;`, { type: QueryTypes.SELECT });
};