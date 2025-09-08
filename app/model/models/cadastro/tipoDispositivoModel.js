const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const tipoDispositivoModel = connect.define(
    'tipo_dispositivo',
    {
        idTipoDispositivo:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        descDispositivo:{
            type: DataTypes.CHAR,
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = tipoDispositivoModel;