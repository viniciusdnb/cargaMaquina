const connect = require('../../connect');
const { DataTypes } = require('sequelize');

const motivoModel = connect.define(
    'motivo',
    {
        idMotivo: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        codigoMotivo: {
            type: DataTypes.CHAR,
        },
        descMotivo: {
            type: DataTypes.CHAR
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = motivoModel;