const subMotivoModel = require('../../model/models/cadastro/subMotivoModel');

module.exports = {
    index: async function(req, res)
    {
        var subMotivos = await subMotivoModel.findAll();

        res.render('lancamento/apontamento-maquina', {pathName: "main", "subMotivos": JSON.stringify(subMotivos, null)});
    }
}