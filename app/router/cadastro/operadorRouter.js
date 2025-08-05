const express = require('express');
const operadorRouter = express.Router();
const operadorController = require('../../controller/cadastro/operadorController');

operadorRouter.get('/operador', function(req, res){
    operadorController.index(req, res);
});

operadorRouter.get('/operador/editar/:idOperador', function(req, res){
    operadorController.edit(req, res);
});

operadorRouter.post('/operador/editar/salvar', function(req, res){
    operadorController.update(req, res);
});
 
operadorRouter.get('/operador/adicionar', function(req, res){
    operadorController.new(req, res);
});

operadorRouter.post('/operador/novo/salvar', function(req, res){
    operadorController.newSave(req, res);
});

operadorRouter.get('/operador/delete/:idOperador', function(req, res){
    operadorController.delete(req, res);
});

module.exports = operadorRouter;