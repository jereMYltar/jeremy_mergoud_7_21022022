const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');

//définition du modèle correspondant à la table éponyme de la base de donnée
const UserConversation = database.define('user_conversation', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},
{
    freezeTableName: true,
    timestamp: false
});

module.exports = UserConversation;

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant user_id et conversation_id
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id de la conversation ou du user supprimée (pour la clause WHERE)