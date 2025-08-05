const conntec = require('../connect');
const {DataTypes} = require('sequelize');

const subMotivoModel = conntec.define(
    'sub_motivo',
    {
        idSubMotivo:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        codigoSubMotivo:{
            type: DataTypes.CHAR
        },
        descSubMotivo:{
            type: DataTypes.CHAR
        },
        idMotivo:{
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = subMotivoModel;