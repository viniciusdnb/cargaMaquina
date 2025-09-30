const express = require('express');
const homeRouter = express.Router();
const homeController = require('../controller/homeController');


homeRouter.get('/', function(req, res){
   homeController.index(req, res);
});

homeRouter.get('/home/ver-fila/:idMaquina', function(req, res){
   homeController.verFila(req, res);
})



module.exports = homeRouter;