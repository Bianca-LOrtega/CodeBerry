const database = require("../database/config");

function listarCaminhoesComAlertas(cnpjEmpresa) {
  const instrucao = `
    SELECT * FROM caminhao WHERE fk_empresa = '${cnpjEmpresa}';
  `;
  return database.executar(instrucao);
}

function kpiTemperatura(cnpj, idCaminhao) {
  const instrucao = `
    SELECT temperatura AS ultimaTemp
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    ORDER BY horario DESC LIMIT 1;
  `;
  return database.executar(instrucao);
}

function kpiUmidade(cnpj, idCaminhao) {
  const instrucao = `
    SELECT umidade AS ultimaUmi
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    ORDER BY horario DESC LIMIT 1;
  `;
  return database.executar(instrucao);
}

function kpiAlertas(cnpj, idCaminhao) {
  const instrucao = `
    SELECT COUNT(*) AS alertas
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    AND (temperatura < 0 OR temperatura > 1 OR umidade < 75 OR umidade > 89);
  `;
  return database.executar(instrucao);
}

function kpiInformacoes(cnpj, idCaminhao) {
  const instrucao = `
    SELECT m.nome AS nomeMotorista, m.telefone AS telefoneMotorista, l.idlote AS idLote
    FROM viagem v
    JOIN motorista m ON v.fk_motorista = m.idmotorista
    JOIN lote l ON v.fk_lote = l.idlote
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    ORDER BY v.idviagem DESC LIMIT 1;
  `;
  return database.executar(instrucao);
}

function buscarDadosGraficos(cnpj, idCaminhao) {
  const instrucao = `
    SELECT r.temperatura, r.umidade, DATE_FORMAT(r.horario, '%H:%i:%s') as horario
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    ORDER BY horario DESC LIMIT 10;
  `;
  return database.executar(instrucao);
}

function buscarUltimoRegistro(cnpj, idCaminhao) {
  const instrucao = `
    SELECT r.temperatura, r.umidade, DATE_FORMAT(r.horario, '%H:%i:%s') as horario
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    ORDER BY horario DESC LIMIT 1;
  `;
  return database.executar(instrucao);
}

function alertasPorDiaSemana(cnpj, idCaminhao) {
  const instrucao = `
    SELECT DAYNAME(horario) as dia, COUNT(*) as total
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    AND (temperatura < 0 OR temperatura > 1 OR umidade < 75 OR umidade > 89)
    GROUP BY dia;
  `;
  return database.executar(instrucao);
}

function alertasPorHoraDia(cnpj, idCaminhao) {
  const instrucao = `
    SELECT HOUR(horario) as hora, COUNT(*) as total
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
    AND (temperatura < 0 OR temperatura > 1 OR umidade < 75 OR umidade > 89)
    GROUP BY hora;
  `;
  return database.executar(instrucao);
}

function cadastrarCaminhao(placa, modelo, status, cnpj) {
  const instrucao = `
    INSERT INTO caminhao (placa, modelo, statuscaminhao, fk_empresa)
    VALUES ('${placa}', '${modelo}', '${status}', '${cnpj}');
  `;
  return database.executar(instrucao);
}

function buscarPlacaCaminhao(idCaminhao) {
  const instrucao = `SELECT placa FROM caminhao WHERE idcaminhao = ${idCaminhao};`;
  return database.executar(instrucao);
}

module.exports = {
  listarCaminhoesComAlertas,
  kpiTemperatura,
  kpiUmidade,
  kpiAlertas,
  kpiInformacoes,
  buscarDadosGraficos,
  alertasPorDiaSemana,
  alertasPorHoraDia,
  cadastrarCaminhao,
  buscarUltimoRegistro,
  buscarPlacaCaminhao
};