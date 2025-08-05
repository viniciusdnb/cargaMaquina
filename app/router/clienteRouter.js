const express = require('express');
const clienteRouter = express.Router();
const clienteController = require('../controller/clienteController');

clienteRouter.get('/cliente', function (req, res) {
    res.render('cadastro/cliente/index', {pathName: 'main'});
    //clienteController.index(req, res);
});

clienteRouter.get('/cliente/editar/:idCliente', function (req, res) {
    clienteController.edit(req, res);
});


clienteRouter.post('/cliente/editar/salvar', function (req, res) {
    clienteController.update(req, res);
});

clienteRouter.get('/cliente/adicionar', function(req, res){
    clienteController.new(req, res);
});

clienteRouter.post('/cliente/novo/salvar', function(req, res){
    clienteController.newSave(req, res);
});

clienteRouter.delete('/cliente/delete/:idCliente', function(req, res){
    console.log(req.params);
})

module.exports = clienteRouter;