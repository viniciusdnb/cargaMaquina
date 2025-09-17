const express = require('express');
const amostraRouter = express.Router();
const amostraController = require('../../controller/lancamento/amostraController');

amostraRouter.get('/amostra', function (req, res) {
   
    amostraController.index(req, res);
});

amostraRouter.get('/amostra/editar/:idAmostraCabecalho', function (req, res) {
    amostraController.edit(req, res);
});


amostraRouter.post('/amostra/editar/salvar', function (req, res) {
    amostraController.update(req, res);
});

amostraRouter.get('/amostra/adicionar', function(req, res){
    amostraController.new(req, res);
});

amostraRouter.post('/amostra/novo/salvar', function(req, res){
    amostraController.newSave(req, res);
});

amostraRouter.get('/amostra/delete/:idAmostraCabecalho', function(req, res){
    amostraController.delete(req, res);
})

module.exports = amostraRouter;