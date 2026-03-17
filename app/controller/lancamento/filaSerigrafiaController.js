
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOp = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const { Op } = require('sequelize');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const fornoModel = require('../../model/models/cadastro/fornoModel');
const maquinario_filaModel = require('../../model/models/lancamento/maquinario_filaModel');
const filaGravacaoModel = require('../../model/models/lancamento/fila_gravacaoModel');
const machineLoad = require('../../libs/machineLoad/MachineLoad');
const configWork = require('../../model/machineLoadModel/configWork');
const fs = require('fs').promises;

ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });
filaGravacaoModel.belongsTo(ordemProducaoModel, { foreignKey: "idOrdemProducao" });

filaGravacaoModel.belongsTo(maquinario_filaModel, { foreignKey: "idMaquinarioFila" });
maquinario_filaModel.hasMany(filaGravacaoModel, { foreignKey: "idMaquinarioFila" });
maquinario_filaModel.belongsTo(fornoModel, { foreignKey: "idForno" });
maquinario_filaModel.belongsTo(maquinaModel, { foreignKey: "idMaquina" });
module.exports = {
    index: async function (req, res) {

        let arrOrdemProducao = await this.getQuantidadeProduzido();



        res.render('lancamento/filaserigrafia', {
            'data': arrOrdemProducao,
            'pathName': 'main'
        });
    },
    getQuantidadeProduzido: async function (idMaquina = null) {
        let ordemProducao = await ordemProducaoModel.findAll(
            {
                where: { idStatus: { [Op.or]: [2, 5, 6, 12] } },
                include: [clienteModel, produtoModel]
            }
        );
        let arrOrdemProducao = JSON.parse(JSON.stringify(ordemProducao, null));
        //funcao para percorrer as ordens de producao e verificar se elas tem lancamentos nos setor da gravacao 
        for (const key in arrOrdemProducao) {
            let ordem = arrOrdemProducao[key]
            if(idMaquina !=null){
                var list = await list_apont_sum_qtd_grop_idOp.findAll({ where: { idOrdemProducao: ordem.idOrdemProducao, idSetor: 2, idMaquina:idMaquina } });
            }else{
                 var list = await list_apont_sum_qtd_grop_idOp.findAll({ where: { idOrdemProducao: ordem.idOrdemProducao, idSetor: 2 } });
            }
            
            let sumQuantidade = 0
            if (list.length != 0) {
                let arrList = JSON.parse(JSON.stringify(list, null));
                arrList.forEach(elementList => {
                    sumQuantidade += Number(elementList.quantidade)
                });
            }

            arrOrdemProducao[key]["quantidadeProduzida"] = sumQuantidade

        }

        return arrOrdemProducao;
    },
    getOrdenacao: async function (ultimoLinhaMaquina) {


        var ultimaLinha = JSON.parse(JSON.stringify(ultimoLinhaMaquina, null));
        
        /*var log = ultimaLinha != null ? JSON.parse(JSON.stringify(ultimoLinhaMaquina, null)) : ">\n";
       
        await fs.appendFile('log.txt',`${log}`,'utf8');*/
       
        return ultimaLinha != null && ultimaLinha.ordenacao >= 0 ? ultimaLinha.ordenacao + 1 : 0;
    },
    setup: async function (req, res) {
        let idOrdemProducao = req.params.idOrdemProducao
        let ordemProducao = await ordemProducaoModel.findAll({
            where: { idOrdemProducao: idOrdemProducao },
            include: [clienteModel, produtoModel]
        });

        let fornos = await fornoModel.findAll();

        let arrOrdemProducao = JSON.parse(JSON.stringify(ordemProducao, null));

        let arrFornos = JSON.parse(JSON.stringify(fornos, null));




        res.render('lancamento/filaserigrafia', {
            'arrOrdemProducao': arrOrdemProducao,
            'arrMaquinas': await this.verificaMaquinaDisponivel(idOrdemProducao),
            'arrFornos': arrFornos,
            'pathName': 'setup'
        });
    },
    getfilaMaquinas: async function (idOrdemProducao) {
        let filaGravacao = await filaGravacaoModel.findAll(
            {
                where: { idOrdemProducao: idOrdemProducao, finalizado: 0 },
                include: [maquinario_filaModel]
            });
        let arrFilaGravacao = JSON.parse(JSON.stringify(filaGravacao, null));


        let arrMaquinas = [];
        let key = 0;
        arrFilaGravacao.forEach(maquinas => {
            arrMaquinas[key] = { "idMaquina": maquinas.maquinario_fila.idMaquina }
            key++;
        });

        return arrMaquinas;
    },
    verificaMaquinaDisponivel: async function (idOrdemProducao) {
        let arrMaquinasEmUso = await this.getfilaMaquinas(idOrdemProducao);
        let maquinas = await maquinaModel.findAll({ where: { [Op.or]: [{ idSetor: 2 }, { idSetor: 3 }] } });
        let arrMaquinas = JSON.parse(JSON.stringify(maquinas, null));
        let arrMaquinasDisponivel = [];
        //arrumar uma forma apos finalizar liberar a maquina para usar para o item
        if (arrMaquinasEmUso.length != 0) {
            arrMaquinas.forEach(maquina => {
                let existMaquina = false;

                for (const key in arrMaquinasEmUso) {
                    if (maquina.idMaquina == arrMaquinasEmUso[key].idMaquina) {
                        existMaquina = true;
                        break;
                    }
                }
                if (!existMaquina) {
                    arrMaquinasDisponivel.push(maquina);
                }

            })

        } else {
            arrMaquinasDisponivel = arrMaquinas;
        }



        return arrMaquinasDisponivel;
    },
    insert: async function (req, res) {
        let arrMaquinas = req.body.maquinas;
        let idForno = req.body.idForno;
        let idOrdemProducao = req.body.idOrdemProducao;
         let numeroGravacao = 1
         if(req.body.valueGravacao){
           numeroGravacao = req.body.valueGravacao
         }
        let arrIdMaquinarioFila = [];

        for (const key in arrMaquinas) {
            let maquinarioFila = await maquinario_filaModel.create({
                idMaquina: arrMaquinas[key].idMaquina,
                idForno: idForno
            });

            arrIdMaquinarioFila.push(maquinarioFila.idMaquinarioFila);
        } 
 
        let ultimoLinhaMaquina = await filaGravacaoModel.findOne({
            order: [['ordenacao', 'DESC']],
            where: { finalizado: 0 },
            include: [{
                model: maquinario_filaModel,
                where: { idMaquina: arrMaquinas[0].idMaquina }
            }]
        });


        for (const key in arrIdMaquinarioFila) {
            await filaGravacaoModel.create({
                idOrdemProducao: idOrdemProducao,
                finalizado: false,
                ordenacao: await this.getOrdenacao(ultimoLinhaMaquina),
                idMaquinarioFila: arrIdMaquinarioFila[key],
                numeroGravacao: numeroGravacao
            });
        }

        res.sendStatus(200);


    },
    verFila: async function (req, res) {
        let fila = await maquinario_filaModel.findAll({
            where: {
                idForno: req.params.idForno
            },
            include: [
                {
                    model: filaGravacaoModel,
                    where: { finalizado: false },
                    include: [
                        {
                            model: ordemProducaoModel,
                            include: [produtoModel, clienteModel]
                        }
                    ]
                },
                { model: fornoModel },
                { model: maquinaModel }
            ]
        });
        let arrFila = JSON.parse(JSON.stringify(fila, null));

        if (arrFila.length != 0) {
            let arrData = JSON.parse(JSON.stringify(this.montarEstruturaFornos(arrFila)));
            
            
            
            for (const f in arrData) {

                for (const m in arrData[f].maquinario) {
                    for (const p in arrData[f].maquinario[m].produtos) {
                       
                        let arrApontamentos = await this.getQuantidadeProduzido(arrData[f].maquinario[m].idMaquina);

                        arrApontamentos.forEach(apontamentos => {
                            
                            if (arrData[f].maquinario[m].produtos[p].idOrdemProducao == apontamentos.idOrdemProducao) {
                                
                                arrData[f].maquinario[m].produtos[p].quantidadeProduzido = apontamentos.quantidadeProduzida
                                
                            }
                        });


                    }

                }
            }
            return res.render(
                'lancamento/filaserigrafia', {
                'arrData': {
                    idForno: arrData[0].idForno,
                    nomeForno: arrData[0].nomeForno,
                    data: await this.gethoras(arrData)
                },
                'pathName': 'fila'
                }
            );

        }

        res.redirect('/fila-serigrafia/preview');

    },
    gethoras: async function (arrData) {

        let maquinarios = arrData[0].maquinario;
        let data = {};

        for (const maquinario of maquinarios) {

            let produtos = maquinario.produtos;
            let nomeMaquina = maquinario.nomeMaquina;
            let prod = {};

            for (const produto of produtos) {

                let result = await this.getCount(produto.idOrdemProducao);

                let qtdOrdem = result <= 0
                    ? produto.quantidade
                    : produto.quantidade / result;

                /*let qtdProduzido = result <= 0
                    ? produto.quantidadeProduzido
                    : produto.quantidadeProduzido / result;*/
                let qtdProduzido = produto.quantidadeProduzido;
                prod[produto.ordenacao] = {
                    cliente: produto.cliente,
                    produto: produto.nomeProduto,
                    ordemProducao: produto.ordemProducao,
                    orderQuantity: qtdOrdem,
                    bpmProduct: 10,
                    setup: 60,
                    quantityProduced: qtdProduzido,
                    previsionStart: "",
                    previsionEnd: "",
                    idFilaMaquina: produto.idFilaGravacao,
                    idOrdemProducao: produto.idOrdemProducao,
                    idMaquina: arrData[0].maquinario[0].idMaquina,
                    numeroGravacao: produto.numeroGravacao
                };

            }
            //corrigir velocidade
            //arrumar forma de considerar individualmente a velocidade do produto
            //arrumar "inverter a logica" da variavel considerBPMMachine
            //false -> considera velocidade da maquina
            //true -> considera velocidade do produto
            data[nomeMaquina] = {
                bpm: 7,
                considerBPMMachine: false,
                queueProducts: prod
            };
        }

        let arrQueue = [];

        for (const key in data) {

            let dataDB = {};
            dataDB.queue = { [key]: data[key] };

            arrQueue.push(
                new machineLoad(dataDB, configWork).getPrevision(key, true)
            );
        }

        return arrQueue;
    },
    previewFila: async function () {
        let fila = await maquinario_filaModel.findAll({

            include: [
                {
                    model: filaGravacaoModel,
                    where: { finalizado: false },
                    include: [
                        {
                            model: ordemProducaoModel,
                            include: [produtoModel, clienteModel]
                        },

                    ]
                },
                { model: fornoModel },
                { model: maquinaModel }
            ]
        });

        //await this.reeordenar(21, 2);
        return JSON.parse(JSON.stringify(fila, null));
    },
    preview: async function (req, res) {
        let arrData = await this.previewFila();
        let fornos = await fornoModel.findAll();
        let maquinas = await maquinaModel.findAll();
        let arrForno = JSON.parse(JSON.stringify(fornos, null));
        let arrMaquina = JSON.parse(JSON.stringify(maquinas, null));

        res.render('lancamento/filaserigrafia', {
            'arrForno': arrForno,
            'arrMaquina': arrMaquina,
            'arrData': JSON.parse(JSON.stringify(this.montarEstruturaFornos(arrData))),
            'pathName': 'preview'
        });
    },
    montarEstruturaFornos: function (arrData) {
        const fornosMap = {};

        arrData.forEach(item => {
            const { forno, maquina, fila_gravacaos } = item;

            
            // 🔥 Cria forno se ainda não existir
            if (!fornosMap[forno.idForno]) {
                fornosMap[forno.idForno] = {
                    idForno: forno.idForno,
                    nomeForno: forno.descricaoForno,
                    maquinario: [],
                    
                };
            }

            const fornoAtual = fornosMap[forno.idForno];

            // 🔎 Verifica se máquina já foi adicionada no forno
            let maquinaExistente = fornoAtual.maquinario.find(
                m => m.idMaquina === maquina.idMaquina
            );

            if (!maquinaExistente) {
                maquinaExistente = {
                    idMaquina: maquina.idMaquina,
                    nomeMaquina: maquina.descMaquina,
                    idSetor: maquina.idSetor,
                    produtos: []
                };

                fornoAtual.maquinario.push(maquinaExistente);
            }

            // 🎯 Adiciona produtos não finalizados e não repetidos
            fila_gravacaos.forEach(fila => {
                //console.log(fila);
                if (fila.finalizado) return;

                const produto = fila?.ordem_producao?.produto;
                if (!produto) return;

                const produtoJaExiste = maquinaExistente.produtos.find(

                    p => p.idProduto === produto.idProduto || p.idOrdemProducao != produto.idOrdemProducao
                );

                if (!produtoJaExiste || produto.idOrdemProducao != produtoJaExiste.idOrdemProducao) {

                    maquinaExistente.produtos.push({

                        idProduto: produto.idProduto,
                        nomeProduto: produto.descProduto,
                        cliente: fila.ordem_producao.cliente.nomeCliente,
                        idOrdemProducao: fila.ordem_producao.idOrdemProducao,
                        ordemProducao: fila.ordem_producao.numeroOrdemProducao,
                        ordenacao: fila.ordenacao,
                        quantidade: fila.ordem_producao.quantidade * produto.numeroGravacao,
                        quantidadeProduzido: "",
                        idFilaGravacao: fila.idFilaGravacao,
                        numeroGravacao: fila.numeroGravacao == 0 ? 1 : fila.numeroGravacao
                    });
                }
            });
        });

        return Object.values(fornosMap);
    },
    finaliza: async function (req, res) {
        let idFilaGravacao = req.params.idFilaGravacao;

        let findAllFila = await filaGravacaoModel.findAll({ where: { idFilaGravacao: idFilaGravacao } })
        let arrFila = JSON.parse(JSON.stringify(findAllFila, null));
        let idMaquinarioFila = arrFila[0].idMaquinarioFila;
        let findAllMaquinario = await maquinario_filaModel.findAll({
            where: { idMaquinarioFila: idMaquinarioFila }
        });
        let arrFilaMaquina = JSON.parse(JSON.stringify(findAllMaquinario, null));

        await filaGravacaoModel.update({ finalizado: 1 },
            {
                where: {
                    idFilaGravacao: idFilaGravacao
                }
            });
        await this.reeordenar(arrFilaMaquina[0].idMaquina, arrFilaMaquina[0].idForno);

        res.redirect("/fila-serigrafia/preview");

    },
    reeordenar: async function (idMaquina, idForno) {
        let findAllMaquinario = await maquinario_filaModel.findAll({
            
            where: { idMaquina: idMaquina, idForno: idForno },
            include: [{
                model: filaGravacaoModel,
                where: { finalizado: false },
                order: [['ordenacao', 'ASC']],
            }]
        });

        let arrFilaMaquinario = JSON.parse(JSON.stringify(findAllMaquinario, null));
        let ordem = 0
        for (const item of arrFilaMaquinario) {
            let id = item.fila_gravacaos[0].idFilaGravacao
            await filaGravacaoModel.update({ ordenacao: ordem }, {
                where: {
                    idFilaGravacao: id
                }
            })
            ordem++;
        }

        //console.log(JSON.parse(JSON.stringify(findAllMaquinario, null)))
    },

    getCount: async function (idOrdemProducao) {
        return await filaGravacaoModel.count({
            where: { idOrdemProducao: idOrdemProducao, finalizado: 0 }
        });
    }

}