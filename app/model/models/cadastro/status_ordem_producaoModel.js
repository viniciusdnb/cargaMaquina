const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const status_ordem_producao = connect.define(
    'status_ordem_producao',
    {
        idStatus:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descricaoStatus:{
            type:DataTypes.CHAR
        }
    },{
        freezeTableName: true,
        timestamps: false
    }

);

module.exports = status_ordem_producao;