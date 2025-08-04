const express = require('express');
const clienteRouter = express.Router();
const clienteController = require('../controller/clienteController');

clienteRouter.get('/clientes', function (req, res) {
    clienteController.index(req, res);
});

clienteRouter.get('/clientes/editar/:idCliente', function (req, res) {

    clienteController.editar(req, res);
});


clienteRouter.post('/cliente/editar/salvar', function (req, res) {
    clienteController.update(req, res);
});

clienteRouter.get('/cliente/adicionar', function(req, res){
    clienteController.new(req, res);
});

clienteRouter.post('/cliente/new/save', function(req, res){
    clienteController.newSave(req, res);
});

clienteRouter.get('/cliente/delete/:idCliente', function(req, res){
    console.log(req.params);
})

module.exports = clienteRouter;