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

function kpiTemperatura(cnpjEmpresa, idCaminhao) {
  const sql = `
        SELECT ROUND(AVG(r.temperatura), 2) AS mediaTemp
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        JOIN empresa e ON c.fk_empresa = e.cnpj
        WHERE e.cnpj = '${cnpjEmpresa}' AND c.idcaminhao = ${idCaminhao};
    `;
  return db.executar(sql);
}

function kpiUmidade(cnpjEmpresa, idCaminhao) {
  const sql = `
        SELECT ROUND(AVG(r.umidade), 2) AS mediaUmi
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        JOIN empresa e ON c.fk_empresa = e.cnpj
        WHERE e.cnpj = '${cnpjEmpresa}' AND c.idcaminhao = ${idCaminhao};
    `;
  return db.executar(sql);
}

function kpiAlertas(cnpjEmpresa, idCaminhao) {
  const sql = `
        SELECT COUNT(*) AS alertas
        FROM registros r
        JOIN viagem v ON r.fk_viagem = v.idviagem
        JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
        JOIN empresa e ON c.fk_empresa = e.cnpj
        WHERE e.cnpj = '${cnpjEmpresa}'
          AND c.idcaminhao = ${idCaminhao}
          AND (r.temperatura < 0 OR r.temperatura > 1);
    `;
  return db.executar(sql);
}

function kpiInformacoes(cnpjEmpresa, idCaminhao) {
  const sql = `
            SELECT 
            m.nome AS nomeMotorista,
            m.telefone AS telefoneMotorista,
            l.idlote AS idLote
            FROM viagem v
            JOIN motorista m ON v.fk_motorista = m.idmotorista
            JOIN lote l ON v.fk_lote = l.idlote
            JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
            WHERE c.fk_empresa = '${cnpjEmpresa}' AND c.idcaminhao = ${idCaminhao}
            ORDER BY v.idviagem DESC
            LIMIT 1;
    `;
  return db.executar(sql);
}

//Gráficos

function buscarDadosGraficos(cnpj, idCaminhao) {
  const instrucaoSql = `
    SELECT 
      DATE_FORMAT(r.horario, '%H:%i') AS horario,
      r.temperatura,
      r.umidade
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    JOIN empresa e ON c.fk_empresa = e.cnpj
    WHERE c.idcaminhao = ${idCaminhao}
      AND e.cnpj = ${cnpj}
    ORDER BY r.horario DESC
    LIMIT 10;
  `;
  return db.executar(instrucaoSql);
}

function alertasPorDiaSemana(cnpj, idCaminhao) {
  const sql = `
    SELECT 
      DAYNAME(r.horario) AS dia,
      COUNT(*) AS total
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
      AND (r.temperatura < 0 OR r.temperatura > 1)
    GROUP BY dia
    ORDER BY FIELD(dia, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  `;
  return db.executar(sql);
}

function alertasPorHoraDia(cnpj, idCaminhao) {
  const sql = `
    SELECT 
      HOUR(r.horario) AS hora,
      COUNT(*) AS total
    FROM registros r
    JOIN viagem v ON r.fk_viagem = v.idviagem
    JOIN caminhao c ON v.fk_caminhao = c.idcaminhao
    WHERE c.fk_empresa = '${cnpj}' AND c.idcaminhao = ${idCaminhao}
      AND (r.temperatura < 0 OR r.temperatura > 1)
    GROUP BY hora
    ORDER BY hora;
  `;
  return db.executar(sql);
}


// CADASTRAR CAMINHÕES:
function cadastrarCaminhao(placa, modelo, fk_empresa) {
  const sql = `INSERT INTO caminhao (placa, modelo, statuscaminhao, fk_empresa) VALUES (?, ?, 'ativo', ?)`;
  return db.query(sql, [placa, modelo, fk_empresa]);
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
  cadastrarCaminhao
};
