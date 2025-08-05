const express = require('express');
const setorRouter = express.Router();
const setorController = require('../controller/setorController');

setorRouter.get('/setor', function(req, res){
    setorController.index(req, res);
});

setorRouter.get('/setor/editar/:idSetor', function(req, res){
    setorController.edit(req, res);
});

setorRouter.post('/setor/editar/salvar', function(req, res){
    setorController.update(req, res);
});

setorRouter.get('/setor/adicionar', function(req, res){
    setorController.new(req, res);
});

setorRouter.post('/setor/novo/salvar', function(req, res){
    setorController.newSave(req, res);
});

setorRouter.get('/setor/delete/:idSetor', function(req, res){
    setorController.delete(req, res);
});

module.exports = setorRouter;