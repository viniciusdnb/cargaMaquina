const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const maquinario_filaModel = connect.define(
    'maquinario_fila',
    {
        idMaquinarioFila:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idMaquina:{
            type: DataTypes.INTEGER
        },
        idForno:{
            type:DataTypes.INTEGER
        }
    },{
        timestamps: false,
        freezeTableName: true
        
    }   
    
);

module.exports = maquinario_filaModel;