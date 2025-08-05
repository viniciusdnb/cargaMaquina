const operadorModel = require('../../model/models/cadastro/operadorModel');

module.exports = {
    index: async function(req, res, msg = null){
        const operadores = await operadorModel.findAll()
        
        let data = JSON.stringify(operadores, null);
        let pathName = 'main';
        res.render('cadastro/operador/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function(req, res){
        const operador = await operadorModel.findAll({where:{idOperador:req.params.idOperador}});
        res.render('cadastro/operador/index',{
            "pathName":'edit',
            "data": JSON.stringify(operador, null)
        });
    },
    update: async function(req, res){
        const operador = await operadorModel.update({
            nomeOperador:req.body.nomeOperador
        },{
            where:{
                idOperador: req.body.idOperador
            }
        });

        res.redirect('/operador');
    },
    new: function(req, res){
        res.render('cadastro/operador/index',{"pathName":"new"});
    },
    newSave: async function(req, res){
         try{
        const oeprador = await operadorModel.create({
            nomeOperador:req.body.nomeOperador
            
        });
       }catch(err){

       }
       res.redirect('/operador')
    },
    delete: async function(req, res){
         try{
            const operador = await operadorModel.destroy({
                where:{
                    idOperador: req.params.idOperador
                }
            });
        }catch(err){
 
        }
        res.redirect('/operador');
    }

}