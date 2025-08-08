const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const statusModel = connect.define(
    'status',
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

module.exports = statusModel;