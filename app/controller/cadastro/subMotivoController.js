const motivoModel = require('../../model/models/cadastro/motivoModel');
const subMotivoModel = require('../../model/models/cadastro/subMotivoModel');

subMotivoModel.belongsTo(motivoModel, { foreignKey: "idMotivo" });

module.exports = {
    index: async function (req, res, msg = null) {
        const subMotivos = await subMotivoModel.findAll({ include: motivoModel });

        let data = JSON.stringify(subMotivos, null);
        let pathName = 'main';
        res.render('cadastro/submotivo/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function (req, res) {
        const submotivo = await subMotivoModel.findAll({
            include: motivoModel, where: { idSubMotivo: req.params.idSubMotivo }
        });

        let data = JSON.stringify(submotivo, null);
        
        const motivos = await motivoModel.findAll();
        res.render('cadastro/submotivo/index', {
            "pathName": "edit",
            "data": data,
            "motivos": JSON.stringify(motivos, null)
        });

    },
    update: async function (req, res) {
        const subMotivo = await subMotivoModel.update({
            codigoSubMotivo: req.body.codigoSubMotivo,
            descSubMotivo: req.body.descSubMotivo,
            idMotivo: req.body.idMotivo
        }, {
            where: {
                idSubMotivo: req.body.idSubMotivo
            }
        });
        res.redirect('/submotivo');
    },
    new: async function (req, res) {
        const motivos = await motivoModel.findAll();
        res.render('cadastro/submotivo/index', {
            "pathName": 'new',
            "motivos": JSON.stringify(motivos, null)
        });
    },
    newSave: async function (req, res) {
        try {
            const subMotivo = await subMotivoModel.create({
                codigoSubMotivo: req.body.codigoSubMotivo,
                descSubMotivo: req.body.descSubMotivo,
                idMotivo: req.body.idMotivo
            });
        } catch (error) {

        }

        res.redirect('/submotivo')
    },
    delete: async function (req, res) {
        try {
            const submotivo = subMotivoModel.destroy({
                where: {
                    idSubMotivo: req.params.idSubMotivo
                }
            });
            // msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            //msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/submotivo');
    }

}