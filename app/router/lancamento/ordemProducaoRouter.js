const express = require('express');
const ordemProducaoRouter = express.Router();
const ordemProducaoController = require('../../controller/lancamento/ordemProducaoController');

ordemProducaoRouter.get('/ordemproducao', function (req, res) {
    //res.render('cadastro/ordemproducao/index', {pathName: 'main'});
    ordemProducaoController.index(req, res);
});

ordemProducaoRouter.get('/ordemproducao/editar/:idOrdemProducao', function (req, res) {
    ordemProducaoController.edit(req, res);
});


ordemProducaoRouter.post('/ordemproducao/editar/salvar', function (req, res) {
    ordemProducaoController.update(req, res);
});

ordemProducaoRouter.get('/ordemproducao/adicionar', function(req, res){
    ordemProducaoController.new(req, res);
});

ordemProducaoRouter.post('/ordemproducao/novo/salvar', function(req, res){
    ordemProducaoController.newSave(req, res);
});

ordemProducaoRouter.get('/ordemproducao/delete/:idOrdemProducao', function(req, res){
    ordemProducaoController.delete(req, res);
})

module.exports = ordemProducaoRouter;