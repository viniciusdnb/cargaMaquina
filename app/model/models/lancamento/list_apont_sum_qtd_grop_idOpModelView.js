const connect = require('../../connect');
const {DataTypes} = require('sequelize');

const list_apont_sum_qtd_grop_idOpModelView = connect.define(
    'list_apont_sum_qtd_grop_idOp',
    {
        idApontDetalhe:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            
        },
	    idApontCabecalho:{
            type:DataTypes.INTEGER
        },		
	    idCabecalho:{
            type:DataTypes.INTEGER
        },
	    idOrdemProducao:{
            type:DataTypes.INTEGER
        },		
	    quantidade:{
            type:DataTypes.INTEGER
        },			
	    idMaquina:{
            type:DataTypes.INTEGER
        },
	    maquinaSetor:{
            type:DataTypes.INTEGER
        },		
	    descMaquina:{
            type:DataTypes.CHAR
        },			
	    idSetor:{
            type:DataTypes.INTEGER
        },
	    descSetor:{
            type:DataTypes.INTEGER
        },
        idProduto:{
             type:DataTypes.INTEGER
        },
        idTipoProduto:{
            type:DataTypes.INTEGER
        }
    },
    {
        tableName: "list_apont_sum_qtd_grop_idOp",
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = list_apont_sum_qtd_grop_idOpModelView;