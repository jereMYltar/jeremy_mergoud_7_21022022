const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');

//définition du modèle correspondant à la table éponyme de la base de donnée
const User = database.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(20)
    },
    lastName: {
        type: DataTypes.STRING(20)
    },
    isMale: {
        type: DataTypes.BOOLEAN
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pseudo: {
        type: DataTypes.STRING(20)
    },
    photo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
},
{
    freezeTableName: true
});

module.exports = User;

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant conversation_id, user_id et content
//- message READ : requêtes brutes ci-dessous
//- message UPDATE : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id du message supprimé (pour la clause WHERE)

//READ la liste des utilisateurs
module.exports.findAllUsers = function () {
    return database.query(`
    SELECT CONCAT(user.firstName, ' ', user.lastName) AS 'name',
        id
    FROM user
    ORDER BY name ASC;
    `, { type: QueryTypes.SELECT });
};

//READ le nom de l'utilisateur à partir de son id
module.exports.findNameById = function (id) {
    return database.query(`
    SELECT CONCAT(user.firstName, ' ', user.lastName) AS 'name'
    FROM user
    WHERE id = ${id};
    `, { type: QueryTypes.SELECT });
};
