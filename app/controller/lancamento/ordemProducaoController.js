const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const tipoOrdemProducaoModel = require('../../model/models/cadastro/tipoOrdemProducaoModel');
const status_ordem_producaoModel = require('../../model/models/cadastro/status_ordem_producaoModel');
const list_apont_sum_qtd_grop_idOpModelView = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');

ordemProducaoModel.belongsTo(clienteModel, { foreignKey: 'idCliente' });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: 'idProduto' });
ordemProducaoModel.belongsTo(tipoOrdemProducaoModel, { foreignKey: 'idTipoOrdemProducao' });
ordemProducaoModel.belongsTo(status_ordem_producaoModel, { foreignKey: "idStatus" });


module.exports = {
    index: async function (req, res, msg = null) {
        const ordemProducao = await ordemProducaoModel.findAll({
            order: [["idOrdemProducao", "DESC"]],
            include: [clienteModel, produtoModel, tipoOrdemProducaoModel, status_ordem_producaoModel]
        });
        const list_apont_sum_qtd_grop_idOp = await list_apont_sum_qtd_grop_idOpModelView.findAll();
        const maquinas = await maquinaModel.findAll();
        res.render('lancamento/ordemproducao/index', {
            "pathName": "main",
            "msg": msg,
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "list_apont_sum_qtd_grop_idOp": JSON.stringify(list_apont_sum_qtd_grop_idOp, null),
            "maquinas": JSON.stringify(maquinas, null)
        })

    },
    edit: async function (req, res) {
        const ordemProducao = await ordemProducaoModel.findAll({
            where: { idOrdemProducao: req.params.idOrdemProducao },
            include: [clienteModel, produtoModel, tipoOrdemProducaoModel, status_ordem_producaoModel]
        });
        let clientes = await clienteModel.findAll();
        let produtos = await produtoModel.findAll();
        let tipoOrdemProducao = await tipoOrdemProducaoModel.findAll();
        let statusOrdemProducao = await status_ordem_producaoModel.findAll();
        res.render('lancamento/ordemproducao/index', {
            "pathName": "edit",
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "clientes": JSON.stringify(clientes, null),
            "produtos": JSON.stringify(produtos, null),
            "tipoOrdemProducao": JSON.stringify(tipoOrdemProducao, null),
            "statusOrdemProducao": JSON.stringify(statusOrdemProducao, null)
        });
    },
    update: async function (req, res) {

        let dataEntrega = new Date(req.body.dataEntrega);

        let ordemProducao = await ordemProducaoModel.update({
            idCliente: req.body.idCliente,
            numeroOrdemProducao: req.body.numeroOrdemProducao,
            loteOrdemProducao: req.body.loteOrdemProducao,
            dataEntrega: req.body.dataEntrega,
            idProduto: req.body.idProduto,
            idTipoOrdemProducao: req.body.idTipoOrdemProducao,
            quantidade: req.body.quantidade,
            idStatus: req.body.idStatusOrdemProducao
        }, {
            where: {
                idOrdemProducao: req.body.idOrdemProducao
            }
        });

        res.redirect('/ordemproducao');
    },
    new: async function (req, res) {
        let clientes = await clienteModel.findAll();
        let produtos = await produtoModel.findAll();
        let tipoOrdemProducao = await tipoOrdemProducaoModel.findAll();

        res.render('lancamento/ordemproducao/index', {
            "pathName": "new",
            "clientes": JSON.stringify(clientes, null),
            "produtos": JSON.stringify(produtos, null),
            "tipoOrdemProducao": JSON.stringify(tipoOrdemProducao, null)
        });
    },
    newSave: async function (req, res) {



        try {
            const ordemProducao = await ordemProducaoModel.create({
                dataLancamento: req.body.dataLancamento,
                idCliente: req.body.idCliente,
                numeroOrdemProducao: req.body.numeroOrdemProducao,
                loteOrdemProducao: req.body.loteOrdemProducao,
                dataEntrega: req.body.dataEntrega,
                idProduto: req.body.idProduto,
                idTipoOrdemProducao: req.body.idTipoOrdemProducao,
                quantidade: req.body.quantidade,
                idStatus: 3
            });
        } catch (err) {

        }

        res.redirect('/ordemproducao');


    },
    ordemProducaoExist: async function (req) {
        //fazer funcao para verificar se ja existe ordem lançada e evitar duplicação
    },
    delete: async function (req, res) {
        try {
            const ordemProducao = ordemProducaoModel.destroy({
                where: {
                    idOrdemProducao: req.params.idOrdemProducao
                }
            });
            // msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            //msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/ordemproducao');


    },
    status: function (req, res) {
        //funcao que retorna o status da ordem da producao
        //indicando quanto que ja foi produzido do item em cada setor
        //se esta finalizado

    },
    pesquisaOrdem: async function (req, res) {
        const { Op } = require('sequelize');
        const textoPesquisa = req.body.textopesquisa;

        const ordemProducao = await ordemProducaoModel.findAll({
            where: {

                [Op.or]: [{ numeroOrdemProducao: textoPesquisa }, { loteOrdemProducao: textoPesquisa }]
            },
            include: [clienteModel, produtoModel, tipoOrdemProducaoModel, status_ordem_producaoModel],
            order: [["idOrdemProducao", "DESC"]],
        });
        const maquinas = await maquinaModel.findAll();
        const list_apont_sum_qtd_grop_idOp = await list_apont_sum_qtd_grop_idOpModelView.findAll();
        res.render('lancamento/ordemproducao/index', {
            "pathName": "main",
            "msg": null,
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "list_apont_sum_qtd_grop_idOp": JSON.stringify(list_apont_sum_qtd_grop_idOp, null),
            "maquinas": JSON.stringify(maquinas, null)
        });


    }

}