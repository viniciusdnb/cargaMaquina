const express = require('express');
const motivoRouter = express.Router();
const motivoController = require('../../controller/cadastro/motivoController');

motivoRouter.get('/motivo', function(req, res){
    motivoController.index(req, res);
});

motivoRouter.get('/motivo/editar/:idMotivo', function(req, res){
    motivoController.edit(req, res);
});

motivoRouter.post('/motivo/editar/salvar', function(req, res){
    motivoController.update(req, res);
});

motivoRouter.get('/motivo/adicionar', function(req, res){
    motivoController.new(req, res);
});

motivoRouter.post('/motivo/novo/salvar', function(req, res){
    motivoController.newSave(req, res);
});

motivoRouter.get('/motivo/delete/:idMotivo', function(req, res){
    motivoController.delete(req, res);
});

module.exports = motivoRouter;