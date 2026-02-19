const filaMaquinaModel = require('../../model/models/lancamento/fila_maquinaModel');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOpModelView = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const machineLoad = require('../../libs/machineLoad/MachineLoad');
const configWork = require('../../model/machineLoadModel/configWork');
const setorModel = require('../../model/models/cadastro/setorModel');



filaMaquinaModel.belongsTo(ordemProducaoModel, { foreignKey: "idOrdemProducao" });
ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });
maquinaModel.belongsTo(setorModel, { foreignKey: "idSetor" });

module.exports = {
    index: async function (req, res, next) {
        const maquinas = await maquinaModel.findAll(
            {include:[setorModel]}
        );
        console.log(JSON.stringify(maquinas, null));
        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });
    },
    getOrdenacao: function (ultimoLinhaMaquina) {


        var ordenacao = JSON.parse(JSON.stringify(ultimoLinhaMaquina, null));

        return ordenacao != null ? JSON.parse(JSON.stringify(ultimoLinhaMaquina, null)).ordenacao + 1 : 0;
    },
    insert: async function (req, res) {

        const maquina = await maquinaModel.findAll(
            {
                where: { idMaquina: req.body.idMaquina },
                include: [setorModel]
            }
        );
        var arrMaquina = JSON.parse(JSON.stringify(maquina, null));

        //FUNCAO PARA INSERIR UMA ORDEM EM UMA FILA DE MAQUINA

        //PEGA O A ULTIMA ORDEM DA FILA ATRAVEZ DA CLASSIFICACAO DESC DO SQL
        //sendo somente ordens de producao nao finalizado
        var ultimoLinhaMaquina = await filaMaquinaModel.findOne({
            order: [['ordenacao', 'DESC']],
            where: { idMaquina: req.body.idMaquina, finalizado: 0 }
        });



        //adiciona mais um na sequecia de ordens ou 0 se a fila da maquina estiver vazia       
        var novaOrdenacao = this.getOrdenacao(ultimoLinhaMaquina);

        //**RESOLVER NO FUTUTO***//
        //VERIFICA SE JA EXISTE ORDEM CADASTRADA - CANCELADO
        //LOGICA CORRETA É
        //VERIFICAR SE JA EXISTE ORDEM CADASTRADA EM UMA DETERMINADA MAQUINA
        //para nao deixa dado duplicado
        // e inser na tabela da fila
        //let result = await this.idOrdemProducaoExist(req.body.idOrdemProducao);

        //se o resultado for diferente de 0 
        //finaliza a funcao insert redirecionando para o index 
        /*if (result != 0) {            
            return res.render('lancamento/filamaquina/index', {
                'msg': "ORDEM CADASTRADA NA FILA COM SUCESSO",
                'maquinas': JSON.stringify(maquinas, null),
                'pathName': 'main'
            });
        }*/

        //insere na tabela da fila
        await filaMaquinaModel.create({
            idMaquina: req.body.idMaquina,
            idOrdemProducao: req.body.idOrdemProducao,
            finalizado: false,
            ordenacao: novaOrdenacao
        });

        var idStatus = "";

        arrMaquina.forEach(maq => {
            if (maq.setor.idSetor == 1) {
                idStatus = 2;
            } else {
                idStatus = 5;
            }
        })


        //atualiza o status da ordem de producao para em fila
        await ordemProducaoModel.update({ idStatus: idStatus }, {
            where: {
                idOrdemProducao: req.body.idOrdemProducao
            }
        })

        //res.redirect('/ordemproducao');


    },
    idOrdemProducaoExist: async function (id) {
        //verifica se o id da ordem ja existe na fila
        //retornanado o tamanho do resultado da consulta

        const fila = await filaMaquinaModel.findAll({ where: { idOrdemProducao: id } });
        return JSON.parse(JSON.stringify(fila, null)).length

    },
    verFila: async function (req, res) {

        const maquinas = await maquinaModel.findAll({include: [setorModel]});

        //tras todas as maquinas cadastrada e verifica se é para considerar velocidade da maquina
        var maquina = await maquinaModel.findAll({
            where: { idMaquina: req.body.idMaquina },
            include: [setorModel]
        });
        maquina = JSON.parse(JSON.stringify(maquina, null));
        maquina = maquina[0];
        var idSetorMaquina = maquina.idSetor;
        var considerBPMMachine = false
        //implementar botao para considerar velocidade da maquina
        if ("considerBPMMachine" in req.body) {
            considerBPMMachine = true
        }


        //var considerBPMMachine = "considerBPMMachine" in req.body ? true : false;


        //tras os dados da fila
        //de acordo com a maquina da requisicao e nao finalizado
        const filaMaquina = await filaMaquinaModel.findAll({
            where: {
                idMaquina: req.body.idMaquina,
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
        if (filaMaquina.length !== 0) {

            var arrFilaMaquina = JSON.parse(JSON.stringify(filaMaquina));
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

            var considerarHoraInicial = false;

            if ("considerarHoraInicial" in req.body) {
                considerarHoraInicial = true
            }

            var prevision = new machineLoad(dataDB, configWork).getPrevision(descMaquina, considerarHoraInicial);

            return res.render('lancamento/filamaquina/index', {
                "pathName": "fila",
                "prevision": prevision.queue[descMaquina].queueProducts,
                "idMaquina": req.body.idMaquina,
                "maquinas": JSON.stringify(maquinas, null),
                "maquinaAtual": maquina
            });
        }


        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main',

        });

    },
    trasnfer: async function (req, res) {
        //transferi a ordem de producao para outra maquina

        //id da nova maquina
        var idNovaMaquina = req.body.idMaquina;

        //id do lancamento da tabela 
        var idFilaMaquina = req.body.idFilaMaquina;

        var idMaquinaAntiga = req.body.idMaquinaAntiga;
        //pega o ultimo numero da ordenacao da nova maquina
        var ultimoLinhaMaquina = await filaMaquinaModel.findOne({
            order: [['ordenacao', 'DESC']],
            where: { idMaquina: idNovaMaquina, finalizado: 0 }
           
        });
        var ordem = this.getOrdenacao(ultimoLinhaMaquina);

        //console.log(JSON.stringify(ultimoLinhaMaquina),null);

        //transferir a ordem de producao de maquina
        //atualiza o id da maquina,
        //atualiza a ordem de acordo com a ultima ordenacao 
        //referente ao id lancamento da tabela
        const filaMaquina = await filaMaquinaModel.update({
            idMaquina: idNovaMaquina,
            ordenacao: ordem
        }, {
            where: {
                idFilaMaquina: idFilaMaquina
            }
        }
        );

        this.reeordenar(idMaquinaAntiga);

        const maquinas = await maquinaModel.findAll({ include:[setorModel]});

        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });

    },
    delete: async function (req, res) {

        console.log(req.params.idFilaMaquina);
        try {
            const fimaMaquin = await filaMaquinaModel.destroy({
                where: {
                    idFilaMaquina: req.params.idFilaMaquina
                },
                include:[setorModel]
            });

            this.reeordenar(req.params.idMaquina)

            const ordemPorducao = await ordemProducaoModel.update({
                idStatus: 1
            }, {
                where: {
                    idOrdemProducao: req.params.idOrdemProducao
                }
            })


        } catch (err) {
            console.log(err);
        }

        const maquinas = await maquinaModel.findAll();

        /*res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });*/
        res.redirect('/filamaquina');


    },
    calcule: async function (req, res) {
        //console.log("Iniciando cálculo...");
        const dataform = req.body; 
        //console.log(dataform);
        const idMaquina = dataform.idMaquina
        const ordens = dataform.ordem
        this.alterarStatusOrdemproducao(ordens);
        //console.log("Ordens recebidas:", ordens);

        try {
            for (const item of ordens) {
                //console.log("Atualizando item:", item);

                await filaMaquinaModel.update(
                    { ordenacao: item.ordem },
                    {
                        where: {
                            idFilaMaquina: item.idFilaMaquina,
                            idMaquina: idMaquina
                        }
                    }
                );
            }
            console.log("Buscando máquinas...");

            const maquinas = await maquinaModel.findAll();

            //console.log("Renderizando página...");
            return res.render('lancamento/filamaquina/index', {
                msg: "",
                maquinas: JSON.stringify(maquinas, null),
                pathName: 'main'
            });

        } catch (error) {
            console.error("Erro ao atualizar fila:", error);
            return res.status(500).send("Erro interno ao processar a requisição.");
        }
    },
    alterarStatusOrdemproducao: async function(fila)
    {
        //funcao para alterar o status dinamicamente quando recalcular o a fila
        //de acordo com o setor da maquina
        //pegar ordem de producao de acordo com o item na fila
        //verificar o setor da maquina
        //a ordem de producao que estiver na posicao 0 da fila
        //recebe o status em pintando ou gravando
        //as demais ordens recebe o status em fila pintura ou em fila gravacao
        
       for(const item of fila)
        {
            console.log(item);
            if(item.ordem == 0){
                await ordemProducaoModel.update({idStatus:3},{
                    where:{
                        idOrdemProducao: item.idOrdemProducao
                    }
                })
            }else{
                await ordemProducaoModel.update({idStatus:2},{
                    where:{
                        idOrdemProducao: item.idOrdemProducao
                    }
                });
            }
            
            
        }
    },
    finalizar: async function (req, res) {

        //funcao que reoderna os registros da fila e altera o status da ordem de producao 
        //de acordo com o tipo de produto

        const idMaquina = req.params.idMaquina;
        const idFilaMaquina = req.params.idFilaMaquina;
        const idOrdemProducao = req.params.idOrdemProducao;

        //pega os dados da ordem de producao e produto de acordo com item da fila
        var arrItemFilaMaquina = JSON.parse(JSON.stringify(
            await filaMaquinaModel.findAll({
                where:{idFilaMaquina: req.params.idFilaMaquina},
                include:{
                    model: ordemProducaoModel,
                    include: [produtoModel]
                }
            })
        ));

        //pega o id do tipo do produto
        arrItemFilaMaquina.forEach(item =>{
             produto = item.ordem_producao.produto;
        });
        var idTipoProduto = produto.idTipoProduto;

        //seta o status para ordem de producao de acordo com o idTipoProduto
       switch (idTipoProduto) {
        case 2:
            var idStatus = 7;
            break;
        case 3:
        case 4:
        case 7:
            var idStatus = 5;
            break;
        case 5:
        case 6:
            var idStatus = 7
            break
        default:
            var idStatus = 1
            break;
       }
    
        //atualiza o somente o registro passado pelo parametro
        const updateFilaMaquina = await filaMaquinaModel.update({ finalizado: 1 }, { where: { idFilaMaquina: idFilaMaquina } });

        this.reeordenar(idMaquina);

        //criar formas de atualizar o status da ordem de acordo com o tipo de produto
        //atualiza o status da ordem de prodcuao
        const odemProducao = await ordemProducaoModel.update({ idStatus: idStatus}, { where: { idOrdemProducao: idOrdemProducao } });

        const maquinas = await maquinaModel.findAll( {include:[setorModel]});
        res.render('lancamento/filamaquina/index', {
            'msg': "",
            'maquinas': JSON.stringify(maquinas, null),
            'pathName': 'main'
        });
    },
    reeordenar: async function (idMaquina) {
        //pega todos os registro da tabela com o id da maquina e o finalizado 0
        const findAllFilaMaquina = await filaMaquinaModel.findAll({ order: [['ordenacao', 'ASC']], where: { idMaquina: idMaquina, finalizado: 0 } });

        const arrFilaMaquina = JSON.parse(JSON.stringify(findAllFilaMaquina))

        //reoderna os registro
        var ordem = 0;
        for (item of arrFilaMaquina) {
            await filaMaquinaModel.update({ ordenacao: ordem }, {
                where: {
                    idFilaMaquina: item.idFilaMaquina,

                }
            });

            //console.log(item.idFilaMaquina + " " + ordem);
            ordem++;
        }
    },
}




