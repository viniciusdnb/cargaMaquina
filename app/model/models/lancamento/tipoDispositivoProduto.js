const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const tipoDispositivoProdutoModel = connect.define(
    'tipo_dispositivo_produto',
    {
        idTipoDispositivoProduto:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idProduto:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idTipoDispositivo:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

const produtoModel = require('../cadastro/produtoModel');
const tipoDispositivoModel = require('../cadastro/tipoDispositivoModel');

tipoDispositivoProdutoModel.belongsTo(produtoModel,{ foreignKey: "idProduto"});
tipoDispositivoProdutoModel.belongsTo(tipoDispositivoModel, {foreignKey: "idTipoDispositivo"});

module.exports = tipoDispositivoProdutoModel;