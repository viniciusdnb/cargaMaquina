const express = require('express');
const filaMaquinaRouter = express.Router();
const filaMaquinaController = require('../../controller/lancamento/filaMaquinaController');

filaMaquinaRouter.get('/filamaquina', function(req, res){
    filaMaquinaController.index(req, res);
})

filaMaquinaRouter.post('/filamaquina/adicionar', function(req, res){
    filaMaquinaController.insert(req, res);
});

filaMaquinaRouter.post('/filamaquina/verfila', function(req, res){
    filaMaquinaController.verFila(req, res);
})

module.exports = filaMaquinaRouter;