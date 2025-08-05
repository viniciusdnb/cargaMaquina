require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const homeRouter = require('./app/router/homeRouter');
const clienteRouter = require('./app/router/cadastro/clienteRouter');
const maquinaRouter = require('./app/router/cadastro/maquinaRouter');
const motivoRouter = require('./app/router/cadastro/motivoRouter');
const operadorRouter = require('./app/router/cadastro/operadorRouter');
const produtoRouter = require('./app/router/cadastro/produtoRouter');
const setorRouter = require('./app/router/cadastro/setorRouter');
const subMotivoRouter = require('./app/router/cadastro/subMotivoRouter');
const tipoProduto = require('./app/router/cadastro/tipoProdutoRouter');
const ordemProducaoRouter = require('./app/router/lancamento/ordemProducaoRouter');


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
app.use('/', tipoProduto);
app.use('/', ordemProducaoRouter);

app.listen(port, function(){
    console.log(`app online in http://${host}:${port}`);
})