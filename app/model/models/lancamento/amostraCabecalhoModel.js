const connect = require('../../connect');
const { DataTypes } = require('sequelize');

const amostraCabecalhoModel = connect.define(
    'amostra_cabecalho',
    {
        idAmostraCabecalho: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataSolicitacao: {
            type: DataTypes.DATE
        },
        dataEntrega: {
            type: DataTypes.DATE
        },
        dataStatus: {
            type: DataTypes.DATE
        },
        idRepresentante: {
            type: DataTypes.INTEGER
        },
        idCliente: {
            type: DataTypes.INTEGER
        },
        idProduto: {
            type: DataTypes.INTEGER
        },
        observacoes: {
            type: DataTypes.CHAR(250)
        },
        idTipoAmostra: {
            type: DataTypes.INTEGER
        },
        idStatusAmostra: {
            type: DataTypes.INTEGER
        },
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = amostraCabecalhoModel;