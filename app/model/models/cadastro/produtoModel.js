const connect = require('../../connect');
const { DataTypes } = require('sequelize');

const produtoModel = connect.define(
    'produto',
    {
        idProduto: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descProduto: {
            type: DataTypes.CHAR
        },
        idTipoProduto: {
            type: DataTypes.INTEGER
        },
        codigoOmie: {
            type: DataTypes.CHAR
        },
        numeroGravacao:{
            type:DataTypes.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = produtoModel;