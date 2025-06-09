// dashboardController.js
const dashboardModel = require('../models/dashboardModel');

/* ======================================================
   LISTAR CAMINHÕES (dashboard.html)
   ====================================================== */
function listarCaminhoesComAlertas(req, res) {
  const { cnpjEmpresa } = req.params;

  dashboardModel.listarCaminhoesComAlertas(cnpjEmpresa)
    .then(resultado => res.status(200).json(resultado))
    .catch(erro => {
      console.error("Erro ao listar caminhões com alertas:", erro);
      res.status(500).json({ erro: "Erro ao listar caminhões" });
    });
}

/* ======================================================
   KPIs
   ====================================================== */
function kpiTemperatura(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiTemperatura(cnpjEmpresa, idCaminhao)
    .then(ret => res.json(ret[0]))
    .catch(err => {
      console.error("Erro ao buscar temperatura média:", err);
      res.status(500).json({ erro: "Erro ao buscar temperatura média" });
    });
}

function kpiUmidade(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiUmidade(cnpjEmpresa, idCaminhao)
    .then(ret => res.json(ret[0]))
    .catch(err => {
      console.error("Erro ao buscar umidade média:", err);
      res.status(500).json({ erro: "Erro ao buscar umidade média" });
    });
}

function kpiAlertas(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiAlertas(cnpjEmpresa, idCaminhao)
    .then(ret => res.json(ret[0]))
    .catch(err => {
      console.error("Erro ao buscar alertas:", err);
      res.status(500).json({ erro: "Erro ao buscar alertas" });
    });
}

function kpiInformacoes(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiInformacoes(cnpjEmpresa, idCaminhao)
    .then(ret => res.json(ret[0]))
    .catch(err => {
      console.error("Erro ao buscar informações:", err);
      res.status(500).json({ erro: "Erro ao buscar informações" });
    });
}

/* ======================================================
   GRÁFICOS
   ====================================================== */
function obterDadosGrafico(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.buscarDadosGraficos(cnpj, idCaminhao)
    .then(ret => res.json(ret))
    .catch(err => {
      console.error("Erro no gráfico:", err);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

function alertasPorDiaSemana(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.alertasPorDiaSemana(cnpj, idCaminhao)
    .then(ret => res.json(ret))
    .catch(err => {
      console.error("Erro ao buscar alertas por dia da semana:", err);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

function alertasPorHoraDia(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.alertasPorHoraDia(cnpj, idCaminhao)
    .then(ret => res.json(ret))
    .catch(err => {
      console.error("Erro ao buscar alertas por hora do dia:", err);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

function ultimosDados(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.buscarUltimoRegistro(cnpj, idCaminhao)
    .then(ret => res.json(ret))
    .catch(err => {
      console.error("Erro ao buscar ultimos registros:", err);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

/* ======================================================
   CADASTRAR CAMINHÃO
   ====================================================== */
function cadastrarCaminhao(req, res) {
  const { placa, modelo, fk_empresa } = req.body;

  if (!placa || !modelo || !fk_empresa) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  dashboardModel.cadastrarCaminhao(placa, modelo, fk_empresa)
    .then(() => res.status(200).json({ mensagem: "Caminhão cadastrado com sucesso!" }))
    .catch(err => {
      console.error("Erro ao cadastrar caminhão:", err);
      res.status(500).json({ erro: "Erro ao cadastrar caminhão.", detalhe: err });
    });
}

/* ======================================================
   NOVO – BUSCAR PLACA PELO ID (para dashboardCaminhao.html)
   ====================================================== */
function buscarPlacaCaminhao(req, res) {
  const { idCaminhao } = req.params;

  dashboardModel.buscarPlacaCaminhao(idCaminhao)
    .then(ret => {
      if (ret.length) return res.status(200).json(ret[0]);
      res.status(404).json({ erro: "Placa não encontrada" });
    })
    .catch(err => {
      console.error("Erro ao buscar placa:", err);
      res.status(500).json({ erro: "Erro ao buscar placa" });
    });
}

/* ======================================================
   EXPORTS
   ====================================================== */
module.exports = {
  listarCaminhoesComAlertas,
  kpiTemperatura,
  kpiUmidade,
  kpiAlertas,
  kpiInformacoes,
  obterDadosGrafico,
  alertasPorDiaSemana,
  alertasPorHoraDia,
  ultimosDados,
  cadastrarCaminhao,
  buscarPlacaCaminhao      // <- adicionado
};