const express = require('express');
const filaSerigrafiaRouter = express.Router();
const filaSerigrafiaController = require('../../controller/lancamento/filaSerigrafiaController');

filaSerigrafiaRouter.get('/fila-serigrafia', function(req, res){
    filaSerigrafiaController.index(req, res);
});

filaSerigrafiaRouter.get('/fila-setup/:idOrdemProducao', function(req, res){
    filaSerigrafiaController.setup(req, res);
});

filaSerigrafiaRouter.post('/fila-serigrafia', function(req, res){
    filaSerigrafiaController.insert(req, res);
})

module.exports = filaSerigrafiaRouter;