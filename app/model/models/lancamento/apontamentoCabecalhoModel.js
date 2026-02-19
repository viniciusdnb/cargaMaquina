const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const apontamentoCabecalho = connect.define(
    'apontamento_cabecalho',
    {
        idApontCabecalho:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data:{
            type: DataTypes.DATE
        },
        idMaquina:{
            type: DataTypes.INTEGER
        },
        idOrdemProducao:{
            type: DataTypes.INTEGER
        },
        idOperador:{
            type: DataTypes.INTEGER
        },
        idForno:{
            type: DataTypes.INTEGER
        },
        numeroGravacao:{
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = apontamentoCabecalho;