const express = require('express');
const clienteRouter = express.Router();
const clienteController = require('../../controller/cadastro/clienteController');

clienteRouter.get('/cliente', function (req, res) {
    //res.render('cadastro/cliente/index', {pathName: 'main'});
    clienteController.index(req, res);
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

clienteRouter.get('/cliente/delete/:idCliente', function(req, res){
    clienteController.delete(req, res);
})

module.exports = clienteRouter;