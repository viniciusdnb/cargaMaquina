const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const setorModel = connect.define(
    'setor',
    {
        idSetor:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descSetor:{
            type: DataTypes.CHAR
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = setorModel;