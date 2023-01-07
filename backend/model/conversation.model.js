const { DataTypes, QueryTypes } = require("sequelize");
const database = require("../config/database");

//définition du modèle correspondant à la table éponyme de la base de donnée
const Conversation = database.define(
  "conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    conversationOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamp: true,
  }
);

module.exports = Conversation;

//définition des fonctions de base du modèle :
//- CREATE - créer une conversation : requête de base de Sequelize => create. Requiert un objet contenant name et conversationOwnerId
//- READ - lire/récupérer une conversation : requêtes brutes ci-dessous
//- UPDATE - mettre à jour une conversation : requête de base de Sequelize => update. Requiert un objet contenant name et conversationOwnerId, ainsi que l'id de la convesation modifié (pour la clause WHERE)
//- DELETE - supprimer une conversation : requête de base de Sequelize => destroy. Requiert l'id de la conversation supprimée (pour la clause WHERE)

//READ : récupérer toutes les conversations auxquelles participe un utilisateur (sur la base de son id)
module.exports.findAllAllowed = function (isAdmin, userId) {
  let sql = `
    SELECT DISTINCT
        conversation.id,
        conversation.name,
        conversation.conversationOwnerId,
        conversation.isClosed,
        conversation.isPublic,
        conversation.updatedAt
    FROM conversation
    LEFT JOIN user_conversation ON user_conversation.conversation_id = conversation.id
    `;
  if (!isAdmin) {
    sql += `WHERE conversation.isPublic = true OR user_conversation.user_id = ${userId}
        `;
  }
  sql += `ORDER BY conversation.updatedAt DESC;`;
  return database.query(sql, { type: QueryTypes.SELECT });
};
