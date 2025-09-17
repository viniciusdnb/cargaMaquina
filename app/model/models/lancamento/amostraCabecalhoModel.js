const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const amostraCabecalhoModel = connect.define(
    'amostra_cabecalho',
    {   
        idAmostraCabecalho:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataSolicitacao:{
            type: DataTypes.DATE
        },
        dataEntrega:{
            type: DataTypes.DATE
        },
        dataAporvacao:{
            type: DataTypes.DATE
        },
        idRepresentante:{
            type: DataTypes.INTEGER
        },
        idCliente:{
            type: DataTypes.INTEGER
        },
        idProduto:{
            type: DataTypes.INTEGER
        },
        padraoFisico:{
            type: DataTypes.BOOLEAN
        },
        padraoPantone:{
            type: DataTypes.BOOLEAN
        },
        aprovacao:{
            type: DataTypes.BOOLEAN
        },
        observacoes:{
            type: DataTypes.CHAR(250)
        }
    }
);

module.exports = amostraCabecalhoModel;