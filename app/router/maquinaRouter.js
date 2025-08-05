const express = require('express');
const maquinaRouter = express.Router();
const maquinaController = require('../controller/maquinaController');

maquinaRouter.get('/maquina', function(req, res){
    maquinaController.index(req, res);
});

maquinaRouter.get('/maquinas/editar/:idMaquina', function(req, res){
    maquinaController.edit(req, res);
});

maquinaRouter.post('/maquinas/editar/salvar', function(req, res){
    maquinaController.update(req, res);
});

maquinaRouter.get('/maquinas/adicionar', function(req, res){
    maquinaController.new(req, res);
});

maquinaRouter.post('/maquinas/novo/salvar', function(req, res){
    maquinaController.new(req, res);
});

maquinaRouter.delete('/maquinas/delete/:idMaquina', function(req, res){
    maquinaController.delete(req, res);
});

module.exports = maquinaRouter;