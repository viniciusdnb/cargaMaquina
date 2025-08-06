const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const tipoOrdemProducao = require('../../model/models/cadastro/tipoProdutoModel');

ordemProducaoModel.belongsTo(clienteModel, {foreignKey: 'idCliente'});
ordemProducaoModel.belongsTo(produtoModel, {foreignKey: 'idProduto'});
ordemProducaoModel.belongsTo(tipoOrdemProducao, {foreignKey: 'idTipoOrdemProducao'});


module.exports = {
    index: async function (req, res, msg = null) {
        const ordemProducao = ordemProducaoModel.findAll({
            order:['idOrdemProducao', 'ACS'],
            include:[clienteModel, produtoModel, tipoOrdemProducao]
        });
        
    },
    edit: async function (req, res) {
        
    },
    update: async function (req, res) {
       
    },
    new: function (req, res) {
       
    },
    newSave: async function (req, res) {

        
    },
    delete: async function (req, res) {
        

    }
}