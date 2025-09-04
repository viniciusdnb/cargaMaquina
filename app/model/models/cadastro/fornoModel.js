const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const fornoModel = connect.define(
    'forno',
    {
        idForno:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        descricaoForno:{
            type: DataTypes.CHAR
        },
        velocidadeForno:{
            type: DataTypes.INTEGER
        },
        undVelocidade:{
            type: DataTypes.CHAR
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);
module.exports = fornoModel;