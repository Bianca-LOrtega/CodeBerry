const db = require('../database/config');

function listarCaminhoesComAlertas(cnpjEmpresa) {
  const instrucaoSql = `
    SELECT 
      c.idcaminhao, 
      c.placa,
      EXISTS (
        SELECT 1
        FROM viagem v
        INNER JOIN registros r ON v.idviagem = r.fk_viagem
        WHERE v.fk_caminhao = c.idcaminhao
          AND (r.temperatura < 0 OR r.temperatura > 1)
        LIMIT 1
      ) AS alerta
    FROM caminhao c
    WHERE c.fk_empresa = '${cnpjEmpresa}';
  `;

  return db.executar(instrucaoSql, [cnpjEmpresa]);
}

// KPI

function alertaTemperatura() {
  const instrucao = `
        SELECT COUNT(*) AS alertas
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        WHERE r.temperatura > 1.5 AND c.statuscaminhao = 'ativo';
    `;
  return db.executar(instrucao);
}

function loteEmTransito() {
  const instrucao = `
        SELECT COUNT(*) AS emTransito
        FROM lote
        WHERE statuslote = 'em trânsito';
    `;
  return db.executar(instrucao);
}

function temperaturaMediaCaminhao() {
  const instrucao = `
        SELECT ROUND(AVG(r.temperatura), 1) AS mediaTemp
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        WHERE c.statuscaminhao = 'ativo';
    `;
  return db.executar(instrucao);
}

function umidadeMediaCaminhao() {
  const instrucao = `
        SELECT ROUND(AVG(r.umidade), 1) AS mediaUmi
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        WHERE c.statuscaminhao = 'ativo';
    `;
  return db.executar(instrucao);
}

function buscarRota(idCaminhao) {
  const sql = `
    SELECT l.localpartida, l.localdestino
    FROM caminhao c
    JOIN viagem v ON c.idcaminhao = v.fk_caminhao
    JOIN lote l ON v.fk_lote = l.idlote
    WHERE c.idcaminhao = ?
    LIMIT 1;
  `;
  return db.executar(sql, [idCaminhao])
    .then(res => res[0][0]);
}

function registrosCaminhao(idCaminhao) {
  const query = `
    SELECT 
      r.horario,
      r.temperatura,
      r.umidade
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    WHERE v.fk_caminhao = ?
    ORDER BY r.horario DESC
    LIMIT 10;
  `;
  return db.executar(query, [idCaminhao])
    .then(res => res[0]);
}


function cadastrarCaminhao(placa, modelo, fk_empresa) {
  const sql = `INSERT INTO caminhao (placa, modelo, statuscaminhao, fk_empresa) VALUES (?, ?, 'ativo', ?)`;
  return db.query(sql, [placa, modelo, fk_empresa]);
}


module.exports = {
  listarCaminhoesComAlertas,
  buscarRota,
  registrosCaminhao,
  alertaTemperatura,
  loteEmTransito,
  temperaturaMediaCaminhao,
  umidadeMediaCaminhao,
  cadastrarCaminhao
};
