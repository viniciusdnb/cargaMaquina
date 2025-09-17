const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const statusAmostraModel = connect.define(
    'status_amostra',
    {
        idStatusAmostra:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descricaoStatusAmostra:{
            type: DataTypes.CHAR
        }  
    },
    {
        timestamps: false,
        freezeTableName: true
    }

);

module.exports = statusAmostraModel;