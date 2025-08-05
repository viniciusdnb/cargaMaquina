const connect = require('../connect');
const { DataTypes } = require('sequelize');

const tipoProduoModel = connect.define(
    'tipo_produto',
    {
        idTipoProduto: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descTipoProduto: {
            type: DataTypes.CHAR
        }

    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = tipoProduoModel;