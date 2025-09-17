const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const representanteModel = connect.define(
    "representante",
    {
        idRepresentante:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomeRepresentante:{
            type: DataTypes.CHAR(50),
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = representanteModel;