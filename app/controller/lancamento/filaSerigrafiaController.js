
const ordemProducaoModel = require('../../model/models/lancamento/ordemProducaoModel');
const clienteModel = require('../../model/models/cadastro/clienteModel');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const list_apont_sum_qtd_grop_idOpModelView = require('../../model/models/lancamento/list_apont_sum_qtd_grop_idOpModelView');
const { Op, fn, col } = require('sequelize');

ordemProducaoModel.belongsTo(clienteModel, { foreignKey: "idCliente" });
ordemProducaoModel.belongsTo(produtoModel, { foreignKey: "idProduto" });
list_apont_sum_qtd_grop_idOpModelView.belongsTo(ordemProducaoModel, { foreignKey: "idOrdemProducao" });

module.exports = {
    index: async function (req, res) {
        let list = await list_apont_sum_qtd_grop_idOpModelView.findAll(
            {
                
                attributes:[
                    'idOrdemProducao',
                    [fn('sum', col('list_apont_sum_qtd_grop_idOp.quantidade')),'total']
                ]
                ,
                where: { idSetor: 2 },
                
                group: "idOrdemProducao",
                include: [
                    {
                        model: ordemProducaoModel,
                        where: {
                            [Op.or]: [
                                { idStatus: 5 },
                                { idStatus: 6 },

                            ]
                        },
                        
                        
                        include: [
                            { model: clienteModel },
                            { model: produtoModel }
                        ]
                    },

                ]

            }
        )

        console.log(JSON.parse(JSON.stringify(list, null)));
        res.render('lancamento/filaserigrafia', {
            'data': JSON.parse(JSON.stringify(list, null)),
            'pathName': 'main'
        });
    }
}