const express = require('express');
const filaSerigrafiaRouter = express.Router();
const filaSerigrafiaController = require('../../controller/lancamento/filaSerigrafiaController');

filaSerigrafiaRouter.get('/fila-serigrafia', function(req, res){
    filaSerigrafiaController.index(req, res);
})

module.exports = filaSerigrafiaRouter;