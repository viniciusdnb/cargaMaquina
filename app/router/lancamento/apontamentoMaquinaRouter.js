const express = require('express');
const apontamentoMaquinaRouter = express.Router();
const apontamentoMaquinaController = require('../../controller/lancamento/apontamentoMaquinaController');

apontamentoMaquinaRouter.get('/apontamento-maquina', function(req, res){
    apontamentoMaquinaController.index(req, res);
});


module.exports = apontamentoMaquinaRouter;
