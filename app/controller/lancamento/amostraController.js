const amostraCabecalhoModel = require('../../model/models/lancamento/amostraCabecalhoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const representanteModel = require('../../model/models/cadastro/representanteModel');
const statusAmostraModel = require('../../model/models/cadastro/statusAmostraModel');
const tipoAmostraModel = require('../../model/models/cadastro/tipoAmostraModel');

amostraCabecalhoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
amostraCabecalhoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });
amostraCabecalhoModel.belongsTo(representanteModel, { foreignKey: "idRepresentante" });
amostraCabecalhoModel.belongsTo(statusAmostraModel, { foreignKey: "idStatusAmostra" });
amostraCabecalhoModel.belongsTo(tipoAmostraModel, { foreignKey: "idTipoAmostra" });

module.exports = {
    index: async function (req, res) {
        const amostraCabecalho = await amostraCabecalhoModel.findAll({
            order:[["idAmostraCabecalho", "DESC"]],
           
            include: [clienteModel, produtoModel, representanteModel, statusAmostraModel, tipoAmostraModel],
        });

        const data = JSON.stringify(amostraCabecalho, null);
        res.render('lancamento/amostra/index', {
            "pathName": "main",
            "data": data
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
    },
    newSave: async function (req, res) {

        var amostraCabecalho = {
            dataSolicitacao: req.body.dataSolicitacao,
            dataEntrega: req.body.dataEntrega ? req.body.dataEntrega : null,
            idRepresentante: req.body.idRepresentante,
            idCliente: req.body.idCliente,
            idProduto: req.body.idProduto,
            idTipoAmostra: req.body.idTipoAmostra,
            idStatusAmostra: req.body.idStatusAmostra,
            dataStatus: req.body.dataStatus ? req.body.dataStatus : null,
            observacoes: req.body.observacoes.trim() ? req.body.observacoes : null
        }

        console.log(amostraCabecalho)
        try {
            await amostraCabecalhoModel.create(amostraCabecalho);

        } catch (error) {
            console.log(error);
        }

        res.redirect('/amostra');
    },
    edit: async function (req, res) {
        var representantes = await representanteModel.findAll();
        var clientes = await clienteModel.findAll();
        var produtos = await produtoModel.findAll();
        var statusAmostra = await statusAmostraModel.findAll();
        var tipoAmostras = await tipoAmostraModel.findAll();
        const amostraCabecalho = await amostraCabecalhoModel.findAll({
            where: {
                idAmostraCabecalho: req.params.idAmostraCabecalho
            },
            include: [clienteModel, produtoModel, representanteModel, statusAmostraModel, tipoAmostraModel]
        });
        const data = JSON.stringify(amostraCabecalho, null);
        res.render('lancamento/amostra/index', {
            "pathName": "edit",
            "representantes": JSON.stringify(representantes, null),
            "clientes": JSON.stringify(clientes, null),
            "produtos": JSON.stringify(produtos, null),
            "statusAmostra": JSON.stringify(statusAmostra, null),
            "tipoAmostras": JSON.stringify(tipoAmostras, null),
            "amostraCabecalho": data
        });
    },
    update: async function (req, res) {

        try {
            await amostraCabecalhoModel.update(
                {
                    idTipoAmostra: req.body.idTipoAmostra,
                    idStatusAmostra: req.body.idStatusAmostra,
                    dataEntrega: req.body.dataEntrega ? req.body.dataEntrega : null,
                    dataStatus: req.body.dataStatus ? req.body.dataStatus : null,
                    observacoes: req.body.observacoes.trim() ? req.body.observacoes : null
                },
                { where: { idAmostraCabecalho: req.body.idAmostraCabecalho } }
            );
        } catch (error) {
            console.log(error);
        }

        res.redirect('/amostra');
    },
    delete: async function (req, res) {
        try {
            await amostraCabecalhoModel.destroy({
                where: {
                    idAmostraCabecalho: req.params.idAmostraCabecalho
                }
            })
        } catch (error) {
            console.log(error);
        }

        res.redirect('/amostra');
    }
}