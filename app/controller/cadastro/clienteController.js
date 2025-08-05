const clienteModel = require('../../model/models/cadastro/clienteModel');

module.exports = {
    index: async function (req, res, msg = null) {

        const clientes = await clienteModel.findAll();
        let data = JSON.stringify(clientes, null);
        let pathName = "main";
        res.render('cadastro/cliente/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });

    },
    edit: async function (req, res) {
        const cliente = await clienteModel.findAll({
            where: {
                idCliente: req.params.idCliente
            }
        });

        let data = JSON.stringify(cliente, null);

        let pathName = "edit";
        res.render('cadastro/cliente/index', {
            "pathName": pathName,
            "data": data
        });
    },
    update: async function (req, res) {
        const cliente = await clienteModel.update({
            nomeCliente: req.body.nomeCliente
        }, {
            where: {
                idCliente: req.body.idCliente
            }
        });

        //let msg = cliente[0] > 0 ? "CADASTRO ALTERADO COM SUCESSO!" : "NAO FOI POSSIVEL ALTERAR, TENTE NOVAMENTE MAIS TARDE";

        res.redirect('/cliente');
    },
    new: function (req, res) {
        res.render('cadastro/cliente/index', { "pathName": "new" });
    },
    newSave: async function (req, res) {

        try {
            const cliente = await clienteModel.create({
                nomeCliente: req.body.nomeCliente
            });

            //let msg = "CADASTRO INSERIDO COM SUCESSO!";
           
        } catch (err) {
            //let msg = "NAO FOI POSSIVEL INSERIR, TENTE NOVAMENTE MAIS TARDE"
            
        }
        res.redirect('/cliente');
    },
    delete: async function (req, res) {
        let msg = "";
        try {
            const cliente = await clienteModel.destroy({
                where: {
                    idCliente: req.params.idCliente
                }
            });

            msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/cliente');

    }
}