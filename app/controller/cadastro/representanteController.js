const representanteModel = require('../../model/models/cadastro/representanteModel');

module.exports = {
    index: async function (req, res, msg = null) {

        const representantes = await representanteModel.findAll();
        let data = JSON.stringify(representantes, null);
        let pathName = "main";
        res.render('cadastro/representante/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });

    },
    edit: async function (req, res) {
        const representante = await representanteModel.findAll({
            where: {
                idRepresentante: req.params.idRepresentante
            }
        });

        let data = JSON.stringify(representante, null);

        let pathName = "edit";
        res.render('cadastro/representante/index', {
            "pathName": pathName,
            "data": data
        });
    },
    update: async function (req, res) {
        const representante = await representanteModel.update({
            nomeRepresentante: req.body.nomeRepresentante
        }, {
            where: {
                idRepresentante: req.body.idRepresentante
            }
        });

     

        res.redirect('/representante');
    },
    new: function (req, res) {
        res.render('cadastro/representante/index', { "pathName": "new" });
    },
    newSave: async function (req, res) {

        try {
            const representante = await representanteModel.create({
                nomeRepresentante: req.body.nomeRepresentante
            });
            
            //let msg = "CADASTRO INSERIDO COM SUCESSO!";
           
        } catch (err) {
            //let msg = "NAO FOI POSSIVEL INSERIR, TENTE NOVAMENTE MAIS TARDE"
            
        }
        res.redirect('/representante');
    },
    delete: async function (req, res) {
        let msg = "";
        try {
            const representante = await representanteModel.destroy({
                where: {
                    idRepresentante: req.params.idRepresentante
                }
            });

            msg = representante > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/representante');

    }
}