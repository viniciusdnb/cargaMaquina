const express = require('express');
const filaMaquinaRouter = express.Router();
const filaMaquinaController = require('../../controller/lancamento/filaMaquinaController');

filaMaquinaRouter.get('/filamaquina', function(req, res){
    filaMaquinaController.index(req, res);
})

filaMaquinaRouter.post('/filamaquina/adicionar', function(req, res, next){
    filaMaquinaController.insert(req, res);
    //quando for necessario nao ter resposta do servidor é só mandar o status e encerra a requisição
    res.status(204).end();
});

filaMaquinaRouter.post('/filamaquina/verfila', function(req, res){
    
    filaMaquinaController.verFila(req, res);
});

filaMaquinaRouter.post('/filamaquina/transferir', function(req, res){    
    filaMaquinaController.trasnfer(req, res);
});

filaMaquinaRouter.get('/filamaquina/delete/:idfilamaqina', function(req, res){
    filaMaquinaController.delete(req, res);
});

filaMaquinaRouter.post('/filamaquina/recalcular', function(req, res){
    filaMaquinaController.calcule(req, res);
});

filaMaquinaRouter.get('/filamaquina/delete/:idFilaMaquina/:idOrdemProducao/:idMaquina', function(req,res){
    filaMaquinaController.delete(req, res);
});

filaMaquinaRouter.get('/filamaquina/finalizar/:idFilaMaquina/:idMaquina/:idOrdemProducao', function(req, res){
    filaMaquinaController.finalizar(req, res);
})

module.exports = filaMaquinaRouter;