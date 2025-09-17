const amostraCabecalhoModel = require('../../model/models/lancamento/amostraCabecalhoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const representanteModel = require('../../model/models/cadastro/representanteModel');
const statusAmostraModel = require('../../model/models/cadastro/statusAmostraModel');
const tipoAmostraModel = require('../../model/models/cadastro/tipoAmostraModel');

module.exports = {
    index: function (req, res) {
        res.render('lancamento/amostra/index', {
            "pathName": "main",


        });
    },
    new: async function (req, res) {
        var representantes = await representanteModel.findAll();
        var clientes = await clienteModel.findAll();
        var produtos = await produtoModel.findAll();
        var statusAmostra = await statusAmostraModel.findAll();
        var tipoAmostras = await tipoAmostraModel.findAll();

        res.render('lancamento/amostra/index', {
            "pathName": "new",
            "representantes": JSON.stringify(representantes, null),
            "clientes": JSON.stringify(clientes, null),
            "produtos": JSON.stringify(produtos, null),
            "statusAmostra": JSON.stringify(statusAmostra, null),
            "tipoAmostras": JSON.stringify(tipoAmostras, null)
        });
    }

}