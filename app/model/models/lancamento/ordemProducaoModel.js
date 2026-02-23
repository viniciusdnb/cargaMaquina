const connect = require('../../connect');
const { DataTypes } = require('sequelize');

const ordemProducaoModel = connect.define(
    'ordem_producao',
    {
        idOrdemProducao: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        numeroOrdemProducao: {
            type: DataTypes.CHAR
        },
        loteOrdemProducao: {
            type: DataTypes.CHAR
        },
        dataLancamento: {
            type: DataTypes.DATE
        },
        dataEntrega: {
            type: DataTypes.DATE
        },
        idCliente: {
            type: DataTypes.INTEGER
        },
        idProduto: {
            type: DataTypes.INTEGER
        },
        idTipoOrdemProducao: {
            type: DataTypes.INTEGER
        },
        quantidade: {
            type: DataTypes.INTEGER
        },
        idStatus:{
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = ordemProducaoModel;