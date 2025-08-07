
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const operadorModel = require('../../model/models/cadastro/operadorModel');
const subMotivoModel = require('../../model/models/cadastro/subMotivoModel');
const apontamentoCabecalhoModel = require('../../model/models/lancamento/apontamentoCabecalhoModel');
const apontamentoDetalheModel = require("../../model/models/lancamento/apontamentoDetalheModel");

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



        try {
            //verificando se o codigo do submotivo esta cadastrado se nao existir a operação é cancelada
            var result = await this.existCodigoSubMotivo(req);

            if (!result) {

                throw new Error("invalido");

            }

            /*-----------------------------------------------------------------------------------------------------*/

            //dados do cabecalho do formulario e inclusao no db
            let cabecalho = {
                data: req.body.data,
                idMaquina: req.body.idMaquina,
                idOrdemProducao: req.body.idOrdemProducao,
                idOperador: req.body.idOperador
            }

            //pegar o id da inclusao
            const apontamentoCabecalho = await apontamentoCabecalhoModel.create(cabecalho);

            const idCabecalho = apontamentoCabecalho.idApontCabecalho;
            /*-----------------------------------------------------------------------------------------------------*/

            //dados da detalhe do formulario, sendo o detalhe composta de varias linhas

            //de acordo com os codigos vindo do formulario
            //pegar as id do submotivo e gera um array para depoin inclusao no db
            var arrIdSubMotivo = [];
            for (const codSub of req.body.codigoSubMotivo) {
                var subMotivo = await subMotivoModel.findAll({ where: { codigoSubMotivo: codSub } });
                var arrIdSub = JSON.stringify(subMotivo, null)
                var jsonIdSub = JSON.parse(arrIdSub);
                //console.log(jsonIdSub[0].idSubMotivo);
                arrIdSubMotivo.push(jsonIdSub[0].idSubMotivo);

            }
            /*-----------------------------------------------------------------------------------------------------*/

            //dados do formulario mais o array de ids
            let detalhe = [
                arrIdSubMotivo,
                req.body.horaInicial,
                req.body.horaFinal,
                req.body.quantidadeProduzido,
                req.body.quantidadeRefugo
            ]

            /*-----------------------------------------------------------------------------------------------------*/

            //criando o numero de linhas do idCabecalho de acordo com envio do formulario de detalhe 

            var linhas = 0;
            var numeroLinhas = detalhe[0].length;


            var arrIdCabecalho = [];
            while (linhas < numeroLinhas) {
                arrIdCabecalho.push(idCabecalho);
                linhas++;
            }
            detalhe.push(arrIdCabecalho);

            /*-----------------------------------------------------------------------------------------------------*/
            //criando o objeto json para inclir no banco as linhas do detalhe do formulario


            linhas = 0;


            var nomeColunas = ["idSubMotivo", "horaInicial", "horaFinal", "quantidadeProduzido", "quantidadeRefugo", "idApontCabecalho"]

            while (linhas < numeroLinhas) {
                var linhaInsert = {};
                for (let nColumn = 0; nColumn < 6; nColumn++) {
                    linhaInsert[nomeColunas[nColumn]] = detalhe[nColumn][linhas];
                }
                linhas++

                var strLinhaInsert = JSON.stringify(linhaInsert);

                var apontamentoDetalhe = apontamentoDetalheModel.create(JSON.parse(strLinhaInsert));

                //console.log(apontamentoDetalhe);


            }
        } catch (error) {
            return res.redirect('/apontamento');
        }

        res.redirect('/apontamento');



    },
    existCodigoSubMotivo: async function (req) {
        var result = true;
        var arrReq = req.body.codigoSubMotivo;
        for (const sub of arrReq) {
            const subMotivo = await subMotivoModel.findAll({ where: { codigoSubMotivo: sub } });

            if (subMotivo.length == 0) {

                result = false;
            }

        };
        return result;
    },

    delete: async function (req, res) {

    }

}