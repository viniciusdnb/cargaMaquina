const tipoProdutoModel = require('../../model/models/cadastro/tipoProdutoModel');

module.exports = {
    index: async function(req, res, msg = null){
          const tipoProdutos = await tipoProdutoModel.findAll()
        
        let data = JSON.stringify(tipoProdutos, null);
        let pathName = 'main';
        res.render('cadastro/tipoproduto/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function(req, res){
        const tipoProduto = await tipoProdutoModel.findAll({where:{idTipoProduto:req.params.idTipoProduto}});
        res.render('cadastro/tipoproduto/index',{
            "pathName":'edit',
            "data": JSON.stringify(tipoProduto, null)
        });
    },
    update: async function(req, res){
         const tipoProduto = await tipoProdutoModel.update({
            descTipoProduto:req.body.descTipoProduto
        },{
            where:{
                idTipoProduto: req.body.idTipoProduto
            }
        });

        res.redirect('/tipoproduto');
    },
    new: function(req, res){
        res.render('cadastro/tipoproduto/index', {"pathName":"new"})
    },
    newSave: async function(req, res){
        try{
        const tipoProduto = await tipoProdutoModel.create({
            descTipoProduto:req.body.descTipoProduto
            
        });
       }catch(err){

       }
       res.redirect('/tipoproduto');
    },
    delete: async function(req, res){
        try{
            const tipoProduto = await tipoProdutoModel.destroy({
                where:{
                   idTipoProduto: req.params.idTipoProduto
                }
            });
        }catch(err){
 
        }
        res.redirect('/tipoproduto');
    }

}