const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const clienteModel = connect.define(
    'cliente',
    {
        idCliente:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nomeCliente:{
            type: DataTypes.CHAR,
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = clienteModel;
