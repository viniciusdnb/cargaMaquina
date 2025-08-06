const { Sequelize } = require('sequelize');
const produtoModel = require('../../model/models/cadastro/produtoModel');
const tipoProdutoModel = require('../../model/models/cadastro/tipoProdutoModel');

produtoModel.belongsTo(tipoProdutoModel, { foreignKey: 'idTipoProduto' })

module.exports = {
    index: async function (req, res, msg = null) {
        const produtos = await produtoModel.findAll()

        let data = JSON.stringify(produtos, null);
        let pathName = 'main';
        res.render('cadastro/produto/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function (req, res) {
        const produto = await produtoModel.findAll({
            include: tipoProdutoModel,
            where: { idProduto: req.params.idProduto }
        });
        const tipoProdutos = await tipoProdutoModel.findAll();
        res.render('cadastro/produto/index', {
            "pathName": 'edit',
            "data": JSON.stringify(produto, null),
            "tipoProdutos": JSON.stringify(tipoProdutos, null)
        });

    },
    update: async function (req, res) {

        const produto = await produtoModel.update({
            descProduto: req.body.descProduto,
            idTipoProduto: req.body.idTipoProduto,
            codigoOmie: req.body.codigoOmie
        }, {
            where: {
                idProduto: req.body.idProduto
            }
        });

        res.redirect('/produto');
    },
    new: async function (req, res) {
        const tipoProdutos = await tipoProdutoModel.findAll();
        res.render('cadastro/produto/index', {
            "pathName": 'new',
            "tipoProdutos": JSON.stringify(tipoProdutos, null)
        })
    },
    newSave: async function (req, res) {
        try {
            const produto = await produtoModel.create({
                descProduto: req.body.descProduto,
                idTipoProduto: req.body.idTipoProduto,
                codigoOmie: req.body.codigoOmie
            })
        } catch (error) {

        }

        res.redirect('/produto')
    },
    delete: async function (req, res) {
        var error = ""
        try {
            const produto = await produtoModel.destroy({
                where: {
                    idProduto: req.params.idProduto
                }
            });
            
            // msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            if (err instanceof Sequelize.BaseError) {
                console.log(err.message);
               error = err.message;
            }
        }
        res.redirect('/produto')
        //this.index(req, res, error)
    }

}