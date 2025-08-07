const connect = require('../../connect');
const { DataTypes, Model } = require('sequelize');

const apontamentoDetalheModel = connect.define(
    'apontamento_detalhe',
    {
        idApontDetalhe: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        horaInicial: {
            type: DataTypes.TIME
        },
        horaFinal: {
            type: DataTypes.TIME
        },
        quantidadeProduzido: {
            type: DataTypes.INTEGER
        },
        quantidadeRefugo: {
            type: DataTypes.INTEGER
        },
        idSubMotivo: {
            type: DataTypes.INTEGER
        },
        idApontCabecalho: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = apontamentoDetalheModel;
