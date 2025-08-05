const maquinaModel = require('../model/models/maquinaModel');
const setorModel = require('../model/models/setorModel');
//criando associação entre os models
//e passando a chave estrangeira
//a tabela que recebe a chave estrangeira liga com a tabela que manda a chave estrangeira 
//indica o nome da coluna da chave estrangeira
maquinaModel.belongsTo(setorModel, { foreignKey: 'idSetor' });

module.exports = {
    index: async function (req, res, msg = null) {
        //na busca da tabela principal inclui a tabela que manda a chave estrangeira
        const maquinas = await maquinaModel.findAll({ include: setorModel })
        
        let data = JSON.stringify(maquinas, null);
        let pathName = 'main';
        res.render('cadastro/maquina/index', {
            "pathName": pathName,
            "data": data,
            "msg": msg
        });
    },
    edit: async function (req, res) {
        const maquina = await maquinaModel.findAll(
            { include: setorModel, where: { idMaquina: req.params.idMaquina } }

        )

        let data = JSON.stringify(maquina, null);
        let setores = await setorModel.findAll();

        let pathName = "edit";
        res.render('cadastro/maquina/index', {
            "pathName": pathName,
            "data": data,
            "setores": JSON.stringify(setores, null)
        });
    },
    update: async function (req, res) {
        const maquina = await maquinaModel.update({
            descMaquina: req.body.descMaquina,
            idSetor: req.body.idSetor,
            velocidade: req.body.velocidade,
            undVelocidade: req.body.undVelocidade
        }, {
            where: {
                idMaquina: req.body.idMaquina,
            }
        });

        res.redirect('/maquina')
    },
    new: async function (req, res) {
        let setores = await setorModel.findAll();
        res.render('cadastro/maquina/index', {
            "pathName": 'new',
            "setores": JSON.stringify(setores, null)
        });
    },
    newSave: async function (req, res) {
        try {
            const maquina = await maquinaModel.create({
                descMaquina: req.body.descMaquina,
                idSetor: req.body.idSetor,
                velocidade: req.body.velocidade,
                undVelocidade: req.body.undVelocidade

            });

            //let msg = "CADASTRO INSERIDO COM SUCESSO!";

        } catch (err) {
            //let msg = "NAO FOI POSSIVEL INSERIR, TENTE NOVAMENTE MAIS TARDE"

        }

        res.redirect('/maquina');
    },
    delete: async function (req, res) {
        let msg = "";
        try {
            const maquina = maquinaModel.destroy({
                where: {
                    idMaquina: req.params.idMaquina
                }
            });
            // msg = cliente > 0 ? "CADASTRO DELETADO COM SUCESSO" : "NÃO FOI POSSIVEL DELETAR";

        } catch (err) {
            //msg = "ERRO, NAO FOI POSSIVEL DELETAR";
        }

        res.redirect('/maquina');
    }

}