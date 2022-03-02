const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Reaction = database.define('reaction', {
    message_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
{
    freezeTableName: true,
    timestamps: true
});

module.exports = Reaction;