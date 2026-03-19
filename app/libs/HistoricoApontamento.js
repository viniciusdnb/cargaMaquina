const apontamentoCabecalhoModel = require('../model/models/lancamento/apontamentoCabecalhoModel');
const apontamentoDetalheModel = require('../model/models/lancamento/apontamentoDetalheModel');
const { Op } = require('sequelize');
const operadorModel = require('../model/models/cadastro/operadorModel');

module.exports = {
    getHistorico: async function (arrFilaMaquina) {
        let idMaquina = arrFilaMaquina[0].idMaquina;
        let idOrdemProducao = arrFilaMaquina[0].idOrdemProducao;

        let apontCabDetModel = await apontamentoCabecalhoModel.findAll({
            where: {
                idMaquina: idMaquina,
                idOrdemProducao: idOrdemProducao
            },
            include: [{
                model: apontamentoDetalheModel,
                where: {
                    idSubMotivo: 1,
                    quantidadeProduzido: {
                        [Op.gt]: 0
                    }
                }
            }, {
                model: operadorModel
            }]
        });

        let arrApontCabDetModel = JSON.parse(JSON.stringify(apontCabDetModel, null))
        let arrHistorico = [];

        arrApontCabDetModel.forEach(historico => {
            arrHistorico.push({
                "idOrdemProducao": idOrdemProducao,
                "data": historico.data,
                "quantidade": historico.apontamento_detalhes[0].quantidadeProduzido,
                "operador": historico.operdor.nomeOperador,
                "idMaquina":idMaquina

            });
        });

        return arrHistorico;
    }


}