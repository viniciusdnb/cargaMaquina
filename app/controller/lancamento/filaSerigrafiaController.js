
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOp = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const { Op, or } = require('sequelize');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const fornoModel = require('../../model/models/cadastro/fornoModel');
const maquinario_filaModel = require('../../model/models/lancamento/maquinario_filaModel');
const filaGravacaoModel = require('../../model/models/lancamento/fila_gravacaoModel');

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
    getQuantidadeProduzido: async function(){
        let ordemProducao = await ordemProducaoModel.findAll(
            {
                where: { idStatus: { [Op.or]: [5, 6] } },
                include: [clienteModel, produtoModel]
            }
        );
        let arrOrdemProducao = JSON.parse(JSON.stringify(ordemProducao, null));
        //funcao para percorrer as ordens de producao e verificar se elas tem lancamentos nos setor da gravacao 
        for (const key in arrOrdemProducao) {
            let ordem = arrOrdemProducao[key]
            let list = await list_apont_sum_qtd_grop_idOp.findAll({ where: { idOrdemProducao: ordem.idOrdemProducao, idSetor: 2 } });
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
    getOrdenacao: function (ultimoLinhaMaquina) {


        var ordenacao = JSON.parse(JSON.stringify(ultimoLinhaMaquina, null));

        return ordenacao != null ? JSON.parse(JSON.stringify(ultimoLinhaMaquina, null)).ordenacao + 1 : 0;
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
                where: { idOrdemProducao: idOrdemProducao },
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
            let filaGravacao = await filaGravacaoModel.create({
                idOrdemProducao: idOrdemProducao,
                finalizado: false,
                ordenacao: this.getOrdenacao(ultimoLinhaMaquina),
                idMaquinarioFila: arrIdMaquinarioFila[key]
            });
        }


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
        let arrFila = JSON.parse(JSON.stringify(fila,null));
        let arrData = JSON.parse(JSON.stringify(this.montarEstruturaFornos(arrFila)));
        let arrApontamentos = await this.getQuantidadeProduzido();
      //console.log(arrFila);
        for(const f in arrData){
            for(const m in arrData[f].maquinario){
                for(const p in arrData[f].maquinario[m].produtos){
                    arrApontamentos.forEach(apontamentos=>{

                        if(arrData[f].maquinario[m].produtos[p].idOrdemProducao == apontamentos.idOrdemProducao){
                            arrData[f].maquinario[m].produtos[p].quantidadeProduzido = apontamentos.quantidadeProduzida
                        }
                    });
                    
                    
                }
              
            }
        }

      
        //console.log(arrData[0].maquinario[0]);
        res.render(
            'lancamento/filaserigrafia',{
              'arrData': arrData,

                'pathName':'fila'
            }
        );
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

            if (!forno || !maquina || !fila_gravacaos) return;

            // 🔥 Cria forno se ainda não existir
            if (!fornosMap[forno.idForno]) {
                fornosMap[forno.idForno] = {
                    idForno: forno.idForno,
                    nomeForno: forno.descricaoForno,
                    maquinario: []
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
                console.log(fila);
                if (fila.finalizado) return;

                const produto = fila?.ordem_producao?.produto;
                if (!produto) return;

                const produtoJaExiste = maquinaExistente.produtos.find(
                    p => p.idProduto === produto.idProduto
                );

                if (!produtoJaExiste) {
                    
                    maquinaExistente.produtos.push({
                        
                        idProduto: produto.idProduto,
                        nomeProduto: produto.descProduto,
                        cliente:fila.ordem_producao.cliente.nomeCliente,
                        idOrdemProducao:fila.ordem_producao.idOrdemProducao,
                        ordemProducao: fila.ordem_producao.numeroOrdemProducao,
                        ordenacao:fila.ordenacao,
                        quantidade:fila.ordem_producao.quantidade,  
                        quantidadeProduzido:""
                    });
                }
            });
        });

        return Object.values(fornosMap);
    }

}