const filaMaquinaModel = require('../model/models/lancamento/fila_maquinaModel');
const maquinaModel = require('../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../model/models/cadastro/clienteModel');
const produtoModel = require('../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOpModelView = require('../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const machineLoad = require('../libs/machineLoad/MachineLoad');
const configWork = require('../model/machineLoadModel/configWork');
const setorModel = require('../model/models/cadastro/setorModel');



filaMaquinaModel.belongsTo(ordemProducaoModel, { foreignKey: "idOrdemProducao" });
ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });
maquinaModel.belongsTo(setorModel, { foreignKey: "idSetor" });


module.exports = {
    index: function (req, res) {
        res.render('home/index');
        
    },
    verFila: async function (req, res) {
        const maquinas = await maquinaModel.findAll({ include: [setorModel] });

        //tras todas as maquinas cadastrada e verifica se é para considerar velocidade da maquina
        var maquina = await maquinaModel.findAll({
            where: { idMaquina: req.params.idMaquina },
            include: [setorModel]
        });
        maquina = JSON.parse(JSON.stringify(maquina, null));
        maquina = maquina[0];
        var idSetorMaquina = maquina.idSetor;
        var considerBPMMachine = true



        //var considerBPMMachine = "considerBPMMachine" in req.body ? true : false;


        //tras os dados da fila
        //de acordo com a maquina da requisicao e nao finalizado
        const filaMaquina = await filaMaquinaModel.findAll({
            where: {
                idMaquina: req.params.idMaquina,
                finalizado: 0
            },
            include: [
                {
                    model: ordemProducaoModel,
                    include: [clienteModel, produtoModel]
                }
            ],
            order: [['ordenacao', 'ASC']]
        });
        //console.log(JSON.parse(JSON.stringify(filaMaquina)));
        //verifica se tem ordem cadastrada na maquina de acordo com o id da maquina passado pela req


        var arrFilaMaquina = JSON.parse(JSON.stringify(filaMaquina));
        console.log(arrFilaMaquina);

        if(arrFilaMaquina.length != 0){
            //tras todo os lancamentos de apontamento da ordem
        //separado por setor da maquina vindo na requisição
        const list_apont_sum_qtd_grop_idOp = await list_apont_sum_qtd_grop_idOpModelView.findAll(
            {
                where: {
                    idSetor: idSetorMaquina
                }
            }
        );
        var arrListaPontamentos = JSON.parse(JSON.stringify(list_apont_sum_qtd_grop_idOp, null));
        
        var data = {};

        arrFilaMaquina.forEach(fila => {
            var quantidade = 0
            //verifica se o id da ordem que esta na fila é igual ao id da lista de apontamentos
            //e passa o valor de quantidade da lista para colocar no corpo de dados para ser
            //calculado nas horas da carga maquina
            arrListaPontamentos.forEach(lista => {

                if (fila.idOrdemProducao == lista.idOrdemProducao) {

                    quantidade += Number(lista.quantidade);

                }
            });
            //corpo
            data[fila.ordenacao] = {
                "cliente": fila.ordem_producao.cliente.nomeCliente,
                "produto": fila.ordem_producao.produto.descProduto,
                "ordemProducao": fila.ordem_producao.numeroOrdemProducao,
                "orderQuantity": fila.ordem_producao.quantidade,
                "bpmProduct": 34,
                "setup": 60,
                "quantityProduced": quantidade,
                "previsionStart": "",
                "previsionEnd": "",
                "idFilaMaquina": fila.idFilaMaquina,
                "idOrdemProducao": fila.idOrdemProducao,
                "idMaquina": fila.idMaquina
            }
        });


        var dataDB = {
            //cabeçalho
            "queue": {
                [maquina.descMaquina]: {
                    "bpm": maquina.velocidade,
                    "considerBPMMachine": considerBPMMachine,
                    "queueProducts": data

                }
            }
        }

        var descMaquina = maquina.descMaquina
        //o calculo de carga maquina só funciona se passar o nome da maquina

        var considerarHoraInicial = true;

       
            
        

        var prevision = new machineLoad(dataDB, configWork).getPrevision(descMaquina, considerarHoraInicial);
        return res.status(200).send(prevision.queue[descMaquina].queueProducts)
        //console.log(prevision.queue[descMaquina].queueProducts);
        /*return res.render('lancamento/filamaquina/index', {
             "pathName": "fila",
             "prevision": prevision.queue[descMaquina].queueProducts,
             "idMaquina": req.body.idMaquina,
             "maquinas": JSON.stringify(maquinas, null),
             "maquinaAtual": maquina
         });*/
        }

        //maquina vazia responde a quantidade -1
        //considerarase o primerio dia como dia numero 1
        //aas funcao de retorno de tatas considera o primeiro dia como 0
        return res.status(200).send(0);
        

    }
}