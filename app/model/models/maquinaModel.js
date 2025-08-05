const connect = require('../connect');
const { DataTypes } = require('sequelize');

const maquinaModel = connect.define(
    'maquina',
    {
        idMaquina: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descMaquina:{
            type: DataTypes.CHAR
        },
        idSetor:{
            type: DataTypes.INTEGER,    
        }
    },
     {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = maquinaModel;
