const express = require('express');
const representanteRouter = express.Router();
const representanteController = require('../../controller/cadastro/representanteController');

representanteRouter.get('/representante', function(req, res){
    representanteController.index(req, res);
});


representanteRouter.get('/representante/editar/:idRepresentante', function (req, res) {
    representanteController.edit(req, res);
});


representanteRouter.post('/representante/editar/salvar', function (req, res) {
    representanteController.update(req, res);
});

representanteRouter.get('/representante/adicionar', function(req, res){
    representanteController.new(req, res);
});

representanteRouter.post('/representante/novo/salvar', function(req, res){
    representanteController.newSave(req, res);
});

representanteRouter.get('/representante/delete/:idRepresentante', function(req, res){
    representanteController.delete(req, res);
})

module.exports = representanteRouter;