const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Reactiontype = database.define('reactiontype', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: true
});

module.exports = Reactiontype;