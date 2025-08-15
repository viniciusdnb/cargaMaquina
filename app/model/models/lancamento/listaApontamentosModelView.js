/*
    sempre quando for criar um model da view que tem no banco de dados
    é obirgatorio indicar a tableName
    mesmo que nao tenha id na view tem que indicar uma chave primaria a um campo que nao 
    tem possibilidade de repetição como um campo de uma das tabelas que a view usa
*/

const connect = require("../../connect");
const { DataTypes } = require('sequelize');

const listaApontamentosModelView = connect.define(
    'lista_apontamento',
    {
        idApontCabecalho: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idOrdemProducaoCabecalho: {
            type: DataTypes.INTEGER
        },
        data: {
            type: DataTypes.DATE
        },
        idOrdemProducao: {
            type: DataTypes.INTEGER
        },
        numeroOrdemProducao: {
            type: DataTypes.CHAR
        },
        loteOrdemProducao: {
            type: DataTypes.CHAR
        },
        idCliente: {
            type: DataTypes.INTEGER
        },
        nomeCliente: {
            type: DataTypes.CHAR
        },
        idProduto: {
            type: DataTypes.INTEGER
        },
        descProduto: {
            type: DataTypes.CHAR
        },
        idOperador:{
            type:DataTypes.INTEGER
        },
        nomeOperador:{
            type:DataTypes.CHAR
        },
        quantidadeProduzido:{
            type:DataTypes.INTEGER
        }
    },{
        tableName: "lista_apontamento",
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = listaApontamentosModelView;