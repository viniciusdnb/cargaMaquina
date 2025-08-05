const express = require('express');
const produtoRouter = express.Router();
const produtoController = require('../../controller/cadastro/produtoController');

produtoRouter.get('/produto', function(req, res){
    produtoController.index(req, res);
});

produtoRouter.get('/produto/editar/:idProduto', function(req, res){
    produtoController.edit(req, res);
});

produtoRouter.post('/produto/editar/salvar', function(req, res){
    produtoController.update(req, res);
});

produtoRouter.get('/produto/adicionar', function(req, res){
    produtoController.new(req, res);
});

produtoRouter.post('/produto/novo/salvar', function(req, res){
    produtoController.newSave(req, res);
});

produtoRouter.get('/produto/delete/:idProduto', function(req, res){
    produtoController.delete(req, res);
});

module.exports = produtoRouter;