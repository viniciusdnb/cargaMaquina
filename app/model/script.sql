CREATE DATABASE dbdecor;

USE dbdecor;

CREATE TABLE cliente(
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    cliente VARCHAR(50)
);

CREATE TABLE tipo_Produto(
    idTipoProduto INT PRIMARY KEY AUTO_INCREMENT,
    descTipoProduto VARCHAR(50)
);

CREATE TABLE produto(
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    descProduto VARCHAR(100),
    idTipoProduto INT,
    codigoOmie VARCHAR(25),
    FOREIGN KEY (idTipoProduto) REFERENCES tipoProduto(idTipoProduto)
);

CREATE TABLE tipo_ordem_producao(
    idTipoOrdemProducao INT PRIMARY KEY AUTO_INCREMENT,
    descTipoOrdemProducao VARCHAR(10)
);

CREATE TABLE ordem_producao(
    idOrdemProducao INT PRIMARY KEY AUTO_INCREMENT,
    numeroOrdemProducao VARCHAR(10),
    loteOrdemProducao VARCHAR(10),
    dataLancamento DATE,
    dataEntrega DATE,
    idCliente INT,
    idProduto INT, 
    idTipoOrdemProducao INT,
    quantidade INT,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto),
    FOREIGN KEY (idTipoOrdemProducao) REFERENCES tipo_ordem_producao(idTipoOrdemProducao)
);

CREATE TABLE setor(
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    descSetor VARCHAR(10) utf8_unicode_ci
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
    velocidade INT,
    undVelocidade VARCHAR(3),
    FOREIGN KEY (idSetor) REFERENCES setor(idSetor)
);

CREATE TABLE operdor(
    idOperador INT PRIMARY KEY AUTO_INCREMENT,
    nomeOperador VARCHAR(100)
);

CREATE TABLE apontamento_cabecalho(
    idApontCabecalho INT PRIMARY KEY AUTO_INCREMENT,
    data DATE,   
    idMaquina INT,
    idOrdemProducao INT,
    idOperador INT,
    FOREIGN KEY (idMaquina) REFERENCES maquina(idMaquina),
    FOREIGN KEY (idOrdemProducao) REFERENCES ordem_producao(idOrdemProducao),
    FOREIGN KEY (idOperador) REFERENCES operdor(idOperador)
);

CREATE TABLE apontamento_detalhe(
    idApontDetalhe INT PRIMARY KEY AUTO_INCREMENT,
    horaInicial TIME,
    horaFinal TIME,
    quantidadeProduzido INT,
    quantidadeRefugo INT,
    observacoes VARCHAR(250),
    idSubMotivo INT,
    idApontCabecalho INT,
    FOREIGN KEY (idSubMotivo) REFERENCES sub_motivo(idSubMotivo),
    FOREIGN KEY (idApontCabecalho) REFERENCES apontamento_cabecalho(idApontCabecalho)
);

