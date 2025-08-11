SELECT
    `ordem_producao`.`idOrdemProducao`,
    `ordem_producao`.`numeroOrdemProducao`,
    `ordem_producao`.`loteOrdemProducao`,
    `ordem_producao`.`dataLancamento`,
    `ordem_producao`.`dataEntrega`,
    `ordem_producao`.`idCliente`,
    `ordem_producao`.`idProduto`,
    `ordem_producao`.`idTipoOrdemProducao`,
    `ordem_producao`.`quantidade`,
    `ordem_producao`.`idStatus`,
    `cliente`.`idCliente` AS `cliente.idCliente`,
    `cliente`.`nomeCliente` AS `cliente.nomeCliente`,
    `produto`.`idProduto` AS `produto.idProduto`,
    `produto`.`descProduto` AS `produto.descProduto`,
    `produto`.`idTipoProduto` AS `produto.idTipoProduto`,
    `produto`.`codigoOmie` AS `produto.codigoOmie`,
    `tipo_ordem_producao`.`idTipoOrdemProducao` AS `tipo_ordem_producao.idTipoOrdemProducao`,
    `tipo_ordem_producao`.`descTipoOrdemProducao` AS `tipo_ordem_producao.descTipoOrdemProducao`,
    `status_ordem_producao`.`idStatus` AS `status_ordem_producao.idStatus`,
    `status_ordem_producao`.`descricaoStatus` AS `status_ordem_producao.descricaoStatus`
FROM
    `ordem_producao` AS `ordem_producao`
    LEFT OUTER JOIN `cliente` AS `cliente` ON `ordem_producao`.`idCliente` = `cliente`.`idCliente`
    LEFT OUTER JOIN `produto` AS `produto` ON `ordem_producao`.`idProduto` = `produto`.`idProduto`
    LEFT OUTER JOIN `tipo_ordem_producao` AS `tipo_ordem_producao` ON `ordem_producao`.`idTipoOrdemProducao` = `tipo_ordem_producao`.`idTipoOrdemProducao`
    LEFT OUTER JOIN `status_ordem_producao` AS `status_ordem_producao` ON `ordem_producao`.`idStatus` = `status_ordem_producao`.`idStatus`
ORDER BY
    `ordem_producao`.`idOrdemProducao` DESC;

SELECT
    `idApontDetalhe`,
    `idApontCabecalho`,
    `idCabecalho`,
    `idOrdemProducao`,
    `quantidade`,
    `idMaquina`,
    `maquinaSetor`,
    `descMaquina`,
    `idSetor`,
    `descSetor`
FROM
    `list_apont_sum_qtd_grop_idOp` AS `list_apont_sum_qtd_grop_idOp`;

SELECT
    `idMaquina`,
    `descMaquina`,
    `idSetor`,
    `velocidade`,
    `undVelocidade`
FROM
    `maquina` AS `maquina`;