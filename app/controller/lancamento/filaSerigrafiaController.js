
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOp = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const { Op, or } = require('sequelize');
const maquinaModel = require('../../model/models/cadastro/maquinaModel');
const fornoModel = require('../../model/models/cadastro/fornoModel');
const filaMaquina = require('../../model/models/lancamento/fila_maquinaModel');
const filaGravacaoModel = require('../../model/models/lancamento/fila_gravacaoModel');

ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });


module.exports = {
    index: async function (req, res) {
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


        res.render('lancamento/filaserigrafia', {
            'data': arrOrdemProducao,
            'pathName': 'main'
        });
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
    getfilaMaquinas: async function(idOrdemProducao){
        let filaGravacao = await filaGravacaoModel.findAll({where:{idOrdemProducao:idOrdemProducao}});
        let arrFilaGravacao = JSON.parse(JSON.stringify(filaGravacao, null));
        let arrMaquinas = [];
        let key = 0;
        arrFilaGravacao.forEach(maquinas=>{
            arrMaquinas[key] = {"idMaquina": maquinas.idMaquina}
            key++;
        });

        return arrMaquinas;
    },

    verificaMaquinaDisponivel: async function(idOrdemProducao)
    {
        let arrMaquinasEmUso = this.getfilaMaquinas(idOrdemProducao);
        let maquinas = await maquinaModel.findAll({ where: { idSetor: 2 } });
        let arrMaquinas = JSON.parse(JSON.stringify(maquinas, null));
        let arrMaquinasDisponivel = [];
        let key = 0;
        arrMaquinas.forEach(maquina =>{
            if(!Object.values(maquina).includes(arrMaquinasEmUso)){
                arrMaquinasDisponivel[key]=maquina;
            }
            key++;
        });

        return arrMaquinasDisponivel;
    },
    insert: async function(req, res){
       


       
    },

    verificaMaquinaFornoOp: async function(req){
        let arrMaquinas = req.body.maquinas;
        let forno = req.body.forno;
        let idOrdemProducao = req.body.idMaquina;

        let filaGravacao = await filaGravacaoModel.findAll({
            where:{
                [Op.and]:[
                    {}
                ]
            }
        })
    }


}