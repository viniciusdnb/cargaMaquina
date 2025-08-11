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
});

filaMaquinaRouter.post('/filamaquina/trasnferir', function(req, res){
    filaMaquinaController.trasnfer(req, res)
});

filaMaquinaRouter.get('/filamaquina/delete/:idfilamaqina', function(req, res){
    filaMaquinaController.delete(req, res);
});

filaMaquinaRouter.post('/filanaquina/recalcular', function(req, res){
    filaMaquinaController.calcule(req, res);
})

module.exports = filaMaquinaRouter;