CREATE DATABASE dbdecor;

USE dbdecor;

CREATE TABLE cliente(
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nomeCliente VARCHAR(50)
)ENGINE=InnoDB;

CREATE TABLE tipo_Produto(
    idTipoProduto INT PRIMARY KEY AUTO_INCREMENT,
    descTipoProduto VARCHAR(50)
)ENGINE=InnoDB;

CREATE TABLE produto(
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    descProduto VARCHAR(100),
    idTipoProduto INT,
    codigoOmie VARCHAR(25),
    FOREIGN KEY (idTipoProduto) REFERENCES tipo_Produto(idTipoProduto)
)ENGINE=InnoDB;

CREATE TABLE tipo_ordem_producao(
    idTipoOrdemProducao INT PRIMARY KEY AUTO_INCREMENT,
    descTipoOrdemProducao VARCHAR(10)
)ENGINE=InnoDB;

CREATE TABLE status_ordem_producao(
    idStatus INT PRIMARY KEY AUTO_INCREMENT,
    descricaoStatus VARCHAR(25)
)ENGINE=InnoDB;

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
    idStatus INT,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto),
    FOREIGN KEY (idTipoOrdemProducao) REFERENCES tipo_ordem_producao(idTipoOrdemProducao),
    FOREIGN KEY (idStatus) REFERENCES status_ordem_producao(idStatus)
)ENGINE=InnoDB;

CREATE TABLE setor(
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    descSetor VARCHAR(10)
)ENGINE=InnoDB;


CREATE TABLE motivo(
    idMotivo INT PRIMARY KEY AUTO_INCREMENT,
    codigoMotivo VARCHAR(10),
    descMotivo VARCHAR(50)
)ENGINE=InnoDB;

CREATE TABLE sub_motivo(
    idSubMotivo INT PRIMARY KEY AUTO_INCREMENT,
    codigoSubMotivo VARCHAR(10),
    descSubMotivo VARCHAR(50),
    idMotivo INT,
    FOREIGN KEY (idMotivo) REFERENCES motivo(idMotivo)
)ENGINE=InnoDB;

CREATE TABLE maquina(
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    descMaquina VARCHAR(50),
    idSetor INT,
    velocidade INT,
    undVelocidade VARCHAR(3),
    FOREIGN KEY (idSetor) REFERENCES setor(idSetor)
)ENGINE=InnoDB;

CREATE TABLE forno (
	idForno INT PRIMARY KEY,
    descricaoForno VARCHAR(50),
    velocidadeForno INT,
    undVelocidade VARCHAR(3)
)ENGINE=InnoDB;

CREATE TABLE operdor(
    idOperador INT PRIMARY KEY AUTO_INCREMENT,
    nomeOperador VARCHAR(100)
)ENGINE=InnoDB;

CREATE TABLE apontamento_cabecalho(
    idApontCabecalho INT PRIMARY KEY AUTO_INCREMENT,
    data DATE,   
    idMaquina INT,
    idOrdemProducao INT,
    idOperador INT,
    idForno INT,
    FOREIGN KEY (idMaquina) REFERENCES maquina(idMaquina),
    FOREIGN KEY (idOrdemProducao) REFERENCES ordem_producao(idOrdemProducao),
    FOREIGN KEY (idOperador) REFERENCES operdor(idOperador),
    FOREIGN KEY (idForno) REFERENCES forno(idForno)
)ENGINE=InnoDB;

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
    FOREIGN KEY (idApontCabecalho) REFERENCES apontamento_cabecalho(idApontCabecalho),
    
)ENGINE=InnoDB;


/*GERA A TABELA DA LISTA DE APONTAMENTOS FEITO*/
CREATE VIEW lista_apontamento AS
SELECT
	apontamento_cabecalho.idApontCabecalho,
    apontamento_cabecalho.idOrdemProducao AS idOrdemProducaoCabecalho, 		  
    apontamento_cabecalho.data,
    apontamento_cabecalho.idOperador AS idOperadorCabecalho,
    ordem_producao.idOrdemProducao,
    ordem_producao.numeroOrdemProducao,
    ordem_producao.loteOrdemProducao, 
    cliente.idCliente, cliente.nomeCliente, 
    produto.idProduto, produto.descProduto,
    maquina.idMaquina, maquina.descMaquina, 
    operdor.idOperador, operdor.nomeOperador,
    apontamento_detalhe.idApontDetalhe,
    apontamento_detalhe.idApontCabecalho AS idApontCabe_detalhe,
    SUM(apontamento_detalhe.quantidadeProduzido)AS quantidadeProduzido
FROM ((((((apontamento_cabecalho
INNER JOIN ordem_producao ON apontamento_cabecalho.idOrdemProducao = ordem_producao.idOrdemProducao)
INNER JOIN cliente ON ordem_producao.idCliente = cliente.idCliente)
INNER JOIN produto ON ordem_producao.idProduto = produto.idProduto)
INNER JOIN maquina ON apontamento_cabecalho.idMaquina = maquina.idMaquina)
INNER JOIN operdor ON apontamento_cabecalho.idOperador = operdor.idOperador)
INNER JOIN apontamento_detalhe ON apontamento_cabecalho.idApontCabecalho = apontamento_detalhe.idApontCabecalho)
GROUP BY apontamento_cabecalho.idApontCabecalho DESC;

'SELECT
	apontamento_cabecalho.idApontCabecalho, apontamento_cabecalho.idOrdemProducao AS idOrdemProducaoCabecalho, 		  
    apontamento_cabecalho.data, apontamento_cabecalho.idOperador AS idOperadorCabecalho,
    ordem_producao.idOrdemProducao, ordem_producao.numeroOrdemProducao, ordem_producao.loteOrdemProducao, 
    cliente.idCliente, cliente.nomeCliente, 
    produto.idProduto, produto.descProduto,
    maquina.idMaquina, maquina.descMaquina, 
    operdor.idOperador, operdor.nomeOperador,
    apontamento_detalhe.idApontDetalhe, apontamento_detalhe.idApontCabecalho AS idApontCabe_detalhe, apontamento_detalhe.quantidadeProduzido
FROM ((((((apontamento_cabecalho
INNER JOIN ordem_producao ON apontamento_cabecalho.idOrdemProducao = ordem_producao.idOrdemProducao)
INNER JOIN cliente ON ordem_producao.idCliente = cliente.idCliente)
INNER JOIN produto ON ordem_producao.idProduto = produto.idProduto)
INNER JOIN maquina ON apontamento_cabecalho.idMaquina = maquina.idMaquina)
INNER JOIN operdor ON apontamento_cabecalho.idOperador = operdor.idOperador)
INNER JOIN apontamento_detalhe ON apontamento_cabecalho.idApontCabecalho = apontamento_detalhe.idApontCabecalho)
WHERE apontamento_detalhe.quantidadeProduzido <> 0
ORDER BY apontamento_cabecalho.idApontCabecalho DESC;'

-- view que lista todos apontamentos somando a quantidade agrupado pela ordem de producao, trazendo setor, maquina
CREATE VIEW list_apont_sum_qtd_grop_idOp AS 
SELECT 
	apontamento_detalhe.idApontDetalhe, apontamento_detalhe.idApontCabecalho, 
	apontamento_cabecalho.idApontCabecalho AS idCabecalho, apontamento_cabecalho.idOrdemProducao,
    SUM(apontamento_detalhe.quantidadeProduzido) AS quantidade,
    maquina.idMaquina, maquina.idSetor AS maquinaSetor, maquina.descMaquina,
	setor.idSetor, setor.descSetor, ordem_producao.idOrdemProducao AS idOrdemProdcao2, ordem_producao.idProduto AS idProdutoOrdemProducao,
    produto.idProduto, produto.idTipoProduto
FROM (((((apontamento_detalhe
INNER JOIN apontamento_cabecalho ON apontamento_detalhe.idApontCabecalho = apontamento_cabecalho.idApontCabecalho)
INNER JOIN maquina ON apontamento_cabecalho.idMaquina = maquina.idMaquina)
INNER JOIN setor ON maquina.idSetor = setor.idSetor)
INNER JOIN ordem_producao ON apontamento_cabecalho.idOrdemProducao = ordem_producao.idOrdemProducao)
INNER JOIN produto ON ordem_producao.idProduto = produto.idProduto)
GROUP BY apontamento_cabecalho.idOrdemProducao, apontamento_cabecalho.idMaquina;



CREATE TABLE fila_maquina (
    idFilaMaquina INT PRIMARY KEY AUTO_INCREMENT,
    idMaquina INT,
    idOrdemProducao INT,
    finalizado BOOLEAN,
    ordenacao INT,
    FOREIGN KEY (idOrdemProducao) REFERENCES ordem_producao(idOrdemProducao),
    FOREIGN key (idMaquina) REFERENCES maquina(idMaquina)
)ENGINE=InnoDB;

CREATE TABLE metas_producao_maquina(
	idMetasProducaoMaquina INT PRIMARY KEY AUTO_INCREMENT,
    idMaquina INT,
    minimo INT,
    meta INT,
    maximo INT,
    FOREIGN KEY (idMaquina) REFERENCES maquina(idMaquina)
)ENGINE=InnoDB;



CREATE TABLE tipo_dispositivo (
    idTipoDispositivo INT PRIMARY KEY AUTO_INCREMENT,
    descDispositivo VARCHAR(50)
)ENGINE=InnoDB;

CREATE TABLE tipo_dispositivo_produto(
    idTipoDispositivoProduto INT PRIMARY KEY AUTO_INCREMENT,
    idProduto INT,
    idTipoDispositivo INT,
    idSetor INT,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto),
    FOREIGN KEY (idTipoDispositivo) REFERENCES tipo_dispositivo(idTipoDispositivo),
    FOREIGN KEY (idSetor) REFERENCES setor(idSetor)
)ENGINE=InnoDB;

CREATE TABLE representante(
    idRepresentante INT PRIMARY KEY AUTO_INCREMENT,
    nomeRepresentante VARCHAR(50)
)ENGINE=InnoDB;


CREATE TABLE amostra_cabecalho(
    idAmostraCabecalho INT PRIMARY KEY AUTO_INCREMENT,
    dataSolicitacao DATE,
    dataEntrega DATE,
    dataAporvacao DATE,
    idRepresentante INT
    idCliente INT,
    idProduto INT,
    padraoFisico BOOLEAN,
    padraoPantone BOOLEAN,
    aprovacao BOOLEAN,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto),
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    FOREIGN KEY (idRepesentante) REFERENCES representante (idRepesentante) 
)ENGINE=InnoDB;


ALTER TABLE tipo_dispositivo_produto ADD COLUMN idSetor INT;
ALTER TABLE tipo_dispositivo_produto ADD CONSTRAINT tipo_dispositivo_produto_ibfk_3 FOREIGN KEY  (idSetor) REFERENCES setor(idSetor);