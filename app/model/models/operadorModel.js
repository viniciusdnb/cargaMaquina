const connect = require('../connect');
const { DataTypes } = require('sequelize');

const operadorModel = connect.define(
    'operdor',
    {
        idOperador: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nomeOperador: {
            type: DataTypes.CHAR
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }

);

module.exports = operadorModel;