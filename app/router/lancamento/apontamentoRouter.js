const express = require('express');
const apontamentoRouter = express.Router();
const apontamentoController = require('../../controller/lancamento/apontamentoController');

apontamentoRouter.get('/apontamento', function (req, res) {
    //res.render('cadastro/ordemproducao/index', {pathName: 'main'});
    apontamentoController.index(req, res);
});

apontamentoRouter.get('/apontamento/editar/:idApontamento', function (req, res) {
    apontamentoController.edit(req, res);
});


apontamentoRouter.post('/apontamento/editar/salvar', function (req, res) {
    apontamentoController.update(req, res);
});

apontamentoRouter.get('/apontamento/adicionar', function(req, res){
    apontamentoController.new(req, res);
});

apontamentoRouter.post('/apontamento/novo/salvar', function(req, res){   
    
    apontamentoController.newSave(req, res);
});

apontamentoRouter.get('/apontamento/delete/:idApontCabecalho', function(req, res){
    apontamentoController.delete(req, res);
});

apontamentoRouter.get('/apontamento/status/:idApontamento', function(req, res){
    apontamentoController.status(req, res);
});

module.exports = apontamentoRouter;