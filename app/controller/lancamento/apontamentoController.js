
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const operadorModel = require('../../model/models/cadastro/operadorModel');
const subMotivoModel = require('../../model/models/cadastro/subMotivoModel');

module.exports = {
    index: async function (req, res, msg = null) {
        const maquinas = await maquinaModel.findAll();
        const ordemProducao = await ordemProducaoModel.findAll();
        const operadores = await operadorModel.findAll();
        res.render('lancamento/apontamento/index', {
            "pathName": "main",
            "msg": msg,
            "maquinas": JSON.stringify(maquinas, null),
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "operadores": JSON.stringify(operadores, null)
        });
    },
    edit: async function (req, res) {

    },
    update: async function (req, res) {

    },
    new: async function (req, res) {
        const maquinas = await maquinaModel.findAll();
        const ordemProducao = await ordemProducaoModel.findAll();
        const operadores = await operadorModel.findAll();
        const subMotivos = await subMotivoModel.findAll();
        res.render('lancamento/apontamento/index', {
            "pathName": "new",
            "maquinas": JSON.stringify(maquinas, null),
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "operadores": JSON.stringify(operadores, null),
            "subMotivos": JSON.stringify(subMotivos, null)
        });
    },
    newSave: async function (req, res) {

    },
    delete: async function (req, res) {

    }

}