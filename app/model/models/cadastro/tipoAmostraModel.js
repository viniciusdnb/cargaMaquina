const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const tipoAmostraModel = connect.define(
    'tipo_amostra',
    {
        idTipoAmostra:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descricaoTipoAmostra:{
            type: DataTypes.CHAR,
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = tipoAmostraModel;
