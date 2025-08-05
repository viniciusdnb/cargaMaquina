const express = require('express');
const subMotivoRouter = express.Router();
const subMotivoController = require('../controller/subMotivoController');

subMotivoRouter.get('/submotivo', function(req, res){
    subMotivoController.index(req, res);
});

subMotivoRouter.get('/submotivo/editar/:idSubMotivo', function(req, res){
    subMotivoController.edit(req, res);
});

subMotivoRouter.post('/submotivo/editar/salvar', function(req, res){
    subMotivoController.update(req, res);
});

subMotivoRouter.get('/submotivo/adicionar', function(req, res){
    subMotivoController.new(req, res);
});

subMotivoRouter.post('/submotivo/novo/salvar', function(req, res){
    subMotivoController.newSave(req, res);
});

subMotivoRouter.get('/submotivo/delete/:idSubMotivo', function(req, res){
    subMotivoController.delete(req, res);
});

module.exports = subMotivoRouter;