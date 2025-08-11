const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const  fila_maquinaModel = connect.define(
    'fila_maquina',
    {
        idFilaMaquina:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true            
        },
        idMaquina:{
             type: DataTypes.INTEGER,             
        },
        idOrdemProducao:{
            type: DataTypes.INTEGER
        },
        ordenacao:{
            type:DataTypes.INTEGER
        },
        finalizado:{
            type: DataTypes.BOOLEAN
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }   
);

module.exports = fila_maquinaModel;