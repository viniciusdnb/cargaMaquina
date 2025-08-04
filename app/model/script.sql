CREATE DATABASE dbdecor;

USE dbdecor;

CREATE TABLE cliente(
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    cliente VARCHAR(50)
);

CREATE TABLE tipoProduto(
    idTipoProduto INT PRIMARY KEY AUTO_INCREMENT,
    tipoProduto VARCHAR(50)
);

CREATE TABLE produto(
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    descProduto VARCHAR(100),
    idTipoProduto INT,
    codigoOmie VARCHAR(25),
    FOREIGN KEY (idTipoProduto) REFERENCES tipoProduto(idTipoProduto)
);

CREATE TABLE ordem_producao(
    idOrdemProducao INT PRIMARY KEY AUTO_INCREMENT,
    numeroOrdemProducao VARCHAR(10),
    loteOrdemProducao VARCHAR(10),
    dataLancamento DATETIME,
    dataEntrega DATETIME,
    idCliente INT,
    idProduto INT, 
    quantidade INT,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto)
);

CREATE TABLE setor(
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    descSetor VARCHAR(10)
);

CREATE TABLE sub_setor(
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    descSubSetor VARCHAR(10)
);

CREATE TABLE motivo(
    idMotivo INT PRIMARY KEY AUTO_INCREMENT,
    codigoMotivo VARCHAR(10),
    descMotivo VARCHAR(50)
);

CREATE TABLE sub_motivo(
    idSubMotivo INT PRIMARY KEY AUTO_INCREMENT,
    codigoSubMotivo VARCHAR(10),
    descSubMotivo VARCHAR(50),
    idMotivo INT,
    FOREIGN KEY (idMotivo) REFERENCES motivo(idMotivo)
);

CREATE TABLE maquina(
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    descMaquina VARCHAR(50),
    idSetor INT,
    FOREIGN KEY (idSetor) REFERENCES setor(idSetor)
);

CREATE TABLE operdor(
    idOperador INT PRIMARY KEY AUTO_INCREMENT,
    nomeOperador VARCHAR(100)
);

CREATE TABLE apontamento_cabecalho(
    idApontCabecalho INT PRIMARY KEY AUTO_INCREMENT,
    data DATETIME,
    finalizado BOOLEAN,
    idMaquina INT,
    idOrdemProducao INT,
    idOperador INT,
    FOREIGN KEY (idMaquina) REFERENCES maquina(idMaquina),
    FOREIGN KEY (idOrdemProducao) REFERENCES ordem_producao(idOrdemProducao),
    FOREIGN KEY (idOperador) REFERENCES operdor(idOperador)
);

CREATE TABLE apontamento_detalhe(
    idApontDetalhe INT PRIMARY KEY AUTO_INCREMENT,
    horaInicial DATETIME,
    horaFinal DATETIME,
    quantidadeProduzido INT,
    quantidadeRefugo INT,
    observacoes VARCHAR(250),
    idSubMotivo INT,
    idApontCabecalho INT,
    FOREIGN KEY (idSubMotivo) REFERENCES sub_motivo(idSubMotivo),
    FOREIGN KEY (idApontCabecalho) REFERENCES apontamento_cabecalho(idApontCabecalho)
);

