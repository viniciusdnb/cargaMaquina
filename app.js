require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const homeRouter = require('./app/router/homeRouter');
const clienteRouter = require('./app/router/clienteRouter');
const maquinaRouter = require('./app/router/maquinaRouter');
const motivoRouter = require('./app/router/motivoRouter');
const operadorRouter = require('./app/router/operadorRouter');
const produtoRouter = require('./app/router/produtoRouter');
const setorRouter = require('./app/router/setorRouter');
const subMotivoRouter = require('./app/router/subMotivoRouter');


app.use(express.static('./app/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use('/', homeRouter);
app.use('/', clienteRouter);
app.use('/', maquinaRouter);
app.use('/', motivoRouter);
app.use('/', operadorRouter);
app.use('/', produtoRouter);
app.use('/', setorRouter);
app.use('/', subMotivoRouter);


app.listen(port, function(){
    console.log(`app online in http://${host}:${port}`);
})