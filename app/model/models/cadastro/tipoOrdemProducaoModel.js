const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const tipoOrdemProducaoModel = connect.define(
    'tipo_ordem_producao',{
        idTipoOrdemProducao: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descTipoOrdemProducao: {
            type: DataTypes.CHAR
        }
    }
    ,
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = tipoOrdemProducaoModel;