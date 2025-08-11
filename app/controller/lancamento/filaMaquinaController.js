const filaMaquinaModel = require('../../model/models/lancamento/fila_maquinaModel');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOpModelView = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const machineLoad = require('../../libs/machineLoad/MachineLoad');
const configWork = require('../../model/machineLoadModel/configWork');


filaMaquinaModel.belongsTo(ordemProducaoModel, { foreignKey: "idOrdemProducao" });
ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });


module.exports = {
    index: async function (req, res) {
        const maquinas = await maquinaModel.findAll();

        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });
    },
    insert: async function (req, res) {


        //PEGA O ULTIMO NUMERO DA ORDEM DE ACORDO COM A MAQUINA
        var ultimoLinhaMaquina = await filaMaquinaModel.findOne({
            order: [['idFilaMaquina', 'DESC']],
            where: { idMaquina: req.body.idMaquina, finalizado: 0 }
        });
        
        var ordenacao = JSON.parse(JSON.stringify(ultimoLinhaMaquina, null))
        var novaOrdenacao = ordenacao != null ? JSON.parse(JSON.stringify(ultimoLinhaMaquina, null)).ordenacao+1:0;

        //VERIFICA SE JA EXISTE ORDEM CADASTRADA
        // e inser na tabela da fila
        let result = await this.idOrdemProducaoExist(req.body.idOrdemProducao);
        if (result == 0) {

            //insere na tabela da fila
            await filaMaquinaModel.create({
                idMaquina: req.body.idMaquina,
                idOrdemProducao: req.body.idOrdemProducao,
                finalizado: false,
                ordenacao: novaOrdenacao
            });

            //atualiza o status da ordem de producao para em fila
            await ordemProducaoModel.update({ idStatus: 6 }, {
                where: {
                    idOrdemProducao: req.body.idOrdemProducao
                }
            })

        };

        const maquinas = await maquinaModel.findAll();

        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });

    },
    idOrdemProducaoExist: async function (id) {
        const fila = await filaMaquinaModel.findAll({ where: { idOrdemProducao: id } });
        return JSON.parse(JSON.stringify(fila, null)).length

    },
    verFila: async function (req, res) {
        console.log(req.body)

        var maquina = await maquinaModel.findAll({
            where: { idMaquina: req.body.idMaquina }
        });
        maquina = JSON.parse(JSON.stringify(maquina, null))
        maquina = maquina[0];
        var considerBPMMachine = "considerBPMMachine" in req.body ? true : false;

        const filaMaquina = await filaMaquinaModel.findAll({
            where: {
                idMaquina: req.body.idMaquina,
                finalizado: false
            },
            include: [
                {
                    model: ordemProducaoModel,
                    include: [clienteModel, produtoModel]
                }
            ]


        });
        var arrFilaMaquina = JSON.parse(JSON.stringify(filaMaquina));

        const list_apont_sum_qtd_grop_idOp = await list_apont_sum_qtd_grop_idOpModelView.findAll()
        var arrListaPontamentos = JSON.parse(JSON.stringify(list_apont_sum_qtd_grop_idOp, null))

        var data = {}
        arrFilaMaquina.forEach(fila => {
            var quantidade = 0
            arrListaPontamentos.forEach(lista => {
                if (fila.idOrdemProducao == lista.idOrdemProducao) {
                    quantidade = lista.quantidade;
                }
            });

            data[fila.ordenacao] = {
                "cliente": fila.ordem_producao.cliente.nomeCliente,
                "produto": fila.ordem_producao.produto.descProduto,
                "ordemProducao": fila.ordem_producao.numeroOrdemProducao,
                "orderQuantity": fila.ordem_producao.quantidade,
                "bpmProduct": 33,
                "setup": 60,
                "quantityProduced": quantidade,
                "previsionStart": "",
                "previsionEnd": ""
            }


        }
        );


        var dataDB = {
            "queue": {
                [maquina.descMaquina]: {
                    "bpm": maquina.velocidade,
                    "considerBPMMachine": considerBPMMachine,
                    "queueProducts": data

                }
            }
        }
        var descMaquina = maquina.descMaquina
        var prevision = new machineLoad(dataDB, configWork).getPrevision(descMaquina);
        
        res.render('lancamento/filamaquina/index', {
            "pathName": "fila",
            "prevision": prevision.queue[descMaquina].queueProducts
        })

    }
}