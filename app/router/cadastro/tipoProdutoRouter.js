const express = require('express');
const tipoProdutoRouter = express.Router();
const tipoProdutoController = require('../../controller/cadastro/tipoProdutoController');

tipoProdutoRouter.get('/tipoproduto', function(req, res){
    tipoProdutoController.index(req, res);
});

tipoProdutoRouter.get('/tipoproduto/editar/:idTipoProduto', function(req, res){
    tipoProdutoController.edit(req, res);
});

tipoProdutoRouter.post('/tipoproduto/editar/salvar', function(req, res){
    tipoProdutoController.update(req, res);
});

tipoProdutoRouter.get('/tipoproduto/adicionar', function(req, res){
    tipoProdutoController.new(req, res);
});

tipoProdutoRouter.post('/tipoproduto/novo/salvar', function(req, res){
    tipoProdutoController.newSave(req, res);
});

tipoProdutoRouter.get('/tipoproduto/delete/:idTipoProduto', function(req, res){
    tipoProdutoController.delete(req, res);
});

module.exports = tipoProdutoRouter;