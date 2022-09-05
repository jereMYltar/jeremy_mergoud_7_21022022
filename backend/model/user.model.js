const { DataTypes, QueryTypes } = require('sequelize');
const database = require('../config/database');

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

//Renvoie la liste des utilisateurs
module.exports.findAllUsers = function () {
    return database.query(`SELECT CONCAT(user.firstName, ' ', user.lastName) AS 'name', id FROM user ORDER BY name ASC;`, { type: QueryTypes.SELECT });
};
