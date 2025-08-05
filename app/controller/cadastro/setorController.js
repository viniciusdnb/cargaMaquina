const setorModel = require('../../model/models/cadastro/setorModel');
module.exports = {
    index: async function (req, res, msg = null) {
        const setores = await setorModel.findAll();
        let data = JSON.stringify(setores, null);
        let pathName = "main";
        res.render('cadastro/setor/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function (req, res) {
        const setor = await setorModel.findAll({
            where: {
                idSetor: req.params.idSetor
            }
        });
        let data = JSON.stringify(setor, null);

        let pathName = "edit";
        res.render('cadastro/setor/index', {
            "pathName": pathName,
            "data": data,
        });

    },
    update: async function (req, res) {
        const setor = await setorModel.update(
            { descSetor: req.body.descSetor },
            { where: { idSetor: req.body.idSetor } }
        );

        //let msg = setor[0] > 0 ? "CADASTRO ALTERADO COM SUCESSO!" : "NAO FOI POSSIVEL ALTERAR, TENTE NOVAMENTE MAIS TARDE";

        res.redirect('/setor');
    },
    new: function (req, res) {
        res.render('cadastro/setor/index', { 'pathName': 'new' })
    },
    newSave: async function (req, res) {
        let msg = ""
        try {
            const setor = await setorModel.create(
                { descSetor: req.body.descSetor }
            )
           // msg = "CADASTRO INSERIDO COM SUCESSO!";

        } catch (err) {
            //msg = "NAO FOI POSSIVEL INSERIR, TENTE NOVAMENTE MAIS TARDE"

        }

        res.redirect('/setor');
    },
    delete: async function (req, res) {
        let msg = "";
        try {
            const setor = setorModel.destroy({
                where: {
                    idSetor: req.params.idSetor
                }
            });
           // msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            //msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/setor');


    }

}