const motivoModel = require('../../model/models/cadastro/motivoModel');

module.exports = {
    index: async function(req, res, msg = null){
        const motivos = await motivoModel.findAll()
        
        let data = JSON.stringify(motivos, null);
        let pathName = 'main';
        res.render('cadastro/motivo/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    }, 
    edit: async function(req, res){
        const motivo = await motivoModel.findAll({where:{idMotivo: req.params.idMotivo}});

        res.render('cadastro/motivo/index',{
            "pathName":'edit',
            "data":JSON.stringify(motivo, null)
        });
    },
    update: async function(req, res){
        const motivo = await motivoModel.update({
            codigoMotivo: req.body.codigoMotivo,
            descMotivo: req.body.descMotivo
        },{
            where:{
                idMotivo: req.body.idMotivo
            }
        });

        res.redirect('/motivo');
    },
    new: function(req, res){
        res.render('cadastro/motivo/index', {"pathName":"new"})
    },
    newSave: async function(req, res){
       
       try{
        const motivo = await motivoModel.create({
            codigoMotivo: req.body.codigoMotivo,
            descMotivo: req.body.descMotivo
        });
       }catch(err){

       }
       res.redirect('/motivo');
    },
    delete: async function(req, res){
        try{
            const motivo = await motivoModel.destroy({
                where:{
                    idMotivo: req.params.idMotivo
                }
            });
        }catch(err){
 
        }
        res.redirect('/motivo');
    }

}