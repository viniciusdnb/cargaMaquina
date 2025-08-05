const express = require('express');
const maquinaRouter = express.Router();
const maquinaController = require('../../controller/cadastro/maquinaController');

maquinaRouter.get('/maquina', function(req, res){
    maquinaController.index(req, res);
});

maquinaRouter.get('/maquina/editar/:idMaquina', function(req, res){
    maquinaController.edit(req, res);
});

maquinaRouter.post('/maquina/editar/salvar', function(req, res){
    maquinaController.update(req, res);
});

maquinaRouter.get('/maquina/adicionar', function(req, res){
    maquinaController.new(req, res);
});

maquinaRouter.post('/maquina/novo/salvar', function(req, res){
    maquinaController.newSave(req, res);
});

maquinaRouter.get('/maquina/delete/:idMaquina', function(req, res){
    maquinaController.delete(req, res);
});

module.exports = maquinaRouter;