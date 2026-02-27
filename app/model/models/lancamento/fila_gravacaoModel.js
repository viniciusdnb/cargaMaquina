const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const fila_gravacaoModel = connect.define(
    'fila_gravacao',
    {
        idFilaGravacao:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true            
        },    
        idMaquinarioFila:{
            type: DataTypes.INTEGER,
            
        },
        idOrdemProducao:{
            type: DataTypes.INTEGER
        },
        finalizado:{
            type: DataTypes.BOOLEAN
        },
        ordenacao:{
            type:DataTypes.INTEGER
        }
    },
    {
        tableName: "fila_gravacao",
        timestamps: false,
        freezeTableName: true
        
    }   
    
);

module.exports = fila_gravacaoModel;