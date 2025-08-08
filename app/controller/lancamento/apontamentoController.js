
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const operadorModel = require('../../model/models/cadastro/operadorModel');
const subMotivoModel = require('../../model/models/cadastro/subMotivoModel');
const apontamentoCabecalhoModel = require('../../model/models/lancamento/apontamentoCabecalhoModel');
const apontamentoDetalheModel = require("../../model/models/lancamento/apontamentoDetalheModel");
const listaApontamentosModelView = require("../../model/models/lancamento/listaApontamentosModelView");





module.exports = {
    index: async function (req, res, msg = null) {
       const listaApontamentos = await listaApontamentosModelView.findAll();
        
        res.render('lancamento/apontamento/index', {
            "pathName": "main",
            "msg": msg,
            "listaApontamentos": JSON.stringify(listaApontamentos, null),
        });
    },
    edit: async function (req, res) {
        const apontamentoCabecalho = await apontamentoCabecalhoModel.findAll({where:{idApontCabecalho:req.params.idApontamento}});
        const apontamentoDetalhe = await apontamentoDetalheModel.findAll({where:{idApontCabecalho:req.params.idApontamento}});
        const maquinas = await maquinaModel.findAll();
        const ordemProducao = await ordemProducaoModel.findAll();
        const operadores = await operadorModel.findAll();
        const subMotivos = await subMotivoModel.findAll()
        res.render('lancamento/apontamento/index',{
            "pathName":"edit",
            "apontamentoOrdemProducaoCabecalho": JSON.stringify(apontamentoCabecalho, null),
            "apontamentoDetalhe": JSON.stringify(apontamentoDetalhe, null),
            "maquinas": JSON.stringify(maquinas, null),
            "ordemProducao": JSON.stringify(ordemProducao, null),
            "operadores": JSON.stringify(operadores, null),
            "subMotivos": JSON.stringify(subMotivos, null)
        });
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
        // NO FUTURO FAZER UM RETORNO DE MENSAGENS E ERROS
        try {
            //verificando se o codigo do submotivo esta cadastrado se nao existir a operação é cancelada
            var result = await this.existCodigoSubMotivo(req);
            if (!result) { throw new Error("invalido"); }
            /*-*/

            //dados do cabecalho do formulario e inclusao no db
            let cabecalho = {
                data: req.body.data,
                idMaquina: req.body.idMaquina,
                idOrdemProducao: req.body.idOrdemProducao,
                idOperador: req.body.idOperador
            }
            //pegar o id da inclusao do cabecalho do formulario
            const apontamentoCabecalho = await apontamentoCabecalhoModel.create(cabecalho);
            const idCabecalho = apontamentoCabecalho.idApontCabecalho;
            /*-*/

            //dados da detalhe do formulario, sendo o detalhe composta de varias linhas
            //de acordo com os codigos vindo do formulario
            //pegar as id do submotivo e gera um array para depoin inclusao no db
            //IMPORTANTE
            //sempre que uma async function tiver um retunr a chamada da funcao tem que ter o await

            var arrIdSubMotivo = await this.getArrayIdSubMotivo(req);
            /*-*/

            //dados do formulario mais o array de ids
            let detalhe = [
                arrIdSubMotivo,
                req.body.horaInicial,
                req.body.horaFinal,
                req.body.quantidadeProduzido,
                req.body.quantidadeRefugo
            ]
            /*-*/

            //criando o numero de linhas do idCabecalho de acordo com envio do formulario de detalhe           
            detalhe.push(this.getArrayIdCabecalho(idCabecalho, detalhe));
            /*-*/
            //IMPORTANTE
            //sempre que uma async function tiver um retunr a chamada da funcao tem que ter o await

            //criando o objeto json para inclir no banco as linhas do detalhe do formulario           
            await this.insertDataDetalhe(detalhe);

        } catch (error) {
            return res.redirect('/apontamento');
        }

        res.redirect('/apontamento');



    },
    existCodigoSubMotivo: async function (req) {
        /* 
            logica de negocio
            se existir algum codigo passado pelo formulario que nao existir o cadastro 
            é retornado um false para interromper o lançamento do detalhe do formulario
        */
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

    },
    getArrayIdSubMotivo: async function (req) {
        /*
            pega os ids referente os codigos passado pelo detalhe do formulario
            retornadoum array de acordo com a quantidade de linha do form detalhe
        */
        let arr = [];
        for (const codSub of req.body.codigoSubMotivo) {
            var subMotivo = await subMotivoModel.findAll({ where: { codigoSubMotivo: codSub } });
            var arrIdSub = JSON.stringify(subMotivo, null)
            var jsonIdSub = JSON.parse(arrIdSub);
            arr.push(jsonIdSub[0].idSubMotivo);
        }

        return arr;
    },
    getArrayIdCabecalho: function (idCabecalho, detalhe) {
        /*
            cria um array de ids repedido
            sendo os ids vindo do insert do cabecalho
            o numero de repeticao é de acordo como numero de linhas do detalhe
        */
        var linhas = 0;
        var numeroLinhas = detalhe[0].length;
        var arrIdCabecalho = [];
        while (linhas < numeroLinhas) {
            arrIdCabecalho.push(idCabecalho);
            linhas++;
        }
        return arrIdCabecalho
    },
    insertDataDetalhe: async function (detalhe) {
        /*
            cria um objeto json com os nomes da coluna junto com os valores do detalhe do formulario e inseri no db
        */

        /*
            verificar se retona os nomes da tabela para substitir a verbosidade da variavel nomeColunas
            apontamentoCabecalhoModel.getAttributes()
        */
        var linhas = 0;
        var nomeColunas = ["idSubMotivo", "horaInicial", "horaFinal", "quantidadeProduzido", "quantidadeRefugo", "idApontCabecalho"];
        var numeroLinhas = detalhe[0].length;

        while (linhas < numeroLinhas) {
            var linhaInsert = {};
            for (let nColumn = 0; nColumn < 6; nColumn++) {
                linhaInsert[nomeColunas[nColumn]] = detalhe[nColumn][linhas];
            }
            linhas++
            var strLinhaInsert = JSON.stringify(linhaInsert);
            await apontamentoDetalheModel.create(JSON.parse(strLinhaInsert));
        }

        return;


    }

}