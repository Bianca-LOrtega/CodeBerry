const dashboardModel = require('../models/dashboardModel');

function listarCaminhoesComAlertas(req, res) {
  const { cnpjEmpresa } = req.params;

  dashboardModel.listarCaminhoesComAlertas(cnpjEmpresa)
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((erro) => {
      console.error("Erro ao listar caminhões com alertas:", erro);
      res.status(500).json({ erro: "Erro ao listar caminhões" });
    });
}

// KPI

function kpiTemperatura(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiTemperatura(cnpjEmpresa, idCaminhao)
    .then(resposta => res.json(resposta[0]))
    .catch(erro => {
      console.error("Erro ao buscar temperatura média:", erro);
      res.status(500).json({ erro: "Erro ao buscar temperatura média" });
    });
}

function kpiUmidade(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiUmidade(cnpjEmpresa, idCaminhao)
    .then(resposta => res.json(resposta[0]))
    .catch(erro => {
      console.error("Erro ao buscar umidade média:", erro);
      res.status(500).json({ erro: "Erro ao buscar umidade média" });
    });
}

function kpiAlertas(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiAlertas(cnpjEmpresa, idCaminhao)
    .then(resposta => res.json(resposta[0]))
    .catch(erro => {
      console.error("Erro ao buscar alertas:", erro);
      res.status(500).json({ erro: "Erro ao buscar alertas" });
    });
}

function kpiInformacoes(req, res) {
  const { cnpjEmpresa, idCaminhao } = req.params;

  dashboardModel.kpiInformacoes(cnpjEmpresa, idCaminhao)
    .then(resposta => res.json(resposta[0]))
    .catch(erro => {
      console.error("Erro ao buscar informações:", erro);
      res.status(500).json({ erro: "Erro ao buscar informações" });
    });
}


//Gráficos

function obterDadosGrafico(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.buscarDadosGraficos(cnpj, idCaminhao)
    .then(resultado => res.json(resultado))
    .catch(erro => {
      console.error("Erro no gráfico:", erro);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

function alertasPorDiaSemana(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.alertasPorDiaSemana(cnpj, idCaminhao)
    .then(resposta => res.json(resposta))
    .catch(erro => {
      console.error("Erro ao buscar alertas por dia da semana:", erro);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}

function alertasPorHoraDia(req, res) {
  const { cnpj, idCaminhao } = req.params;

  dashboardModel.alertasPorHoraDia(cnpj, idCaminhao)
    .then(resposta => res.json(resposta))
    .catch(erro => {
      console.error("Erro ao buscar alertas por hora do dia:", erro);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    });
}


// CADASTRAR CAMINHAO:
function cadastrarCaminhao(req, res) {
  const { placa, modelo, fk_empresa } = req.body;

  if (!placa || !modelo || !fk_empresa) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  dashboardModel.cadastrarCaminhao(placa, modelo, fk_empresa)
    .then(() => res.status(200).json({ mensagem: "Caminhão cadastrado com sucesso!" }))
    .catch(erro => {
      console.error("Erro ao cadastrar caminhão:", erro); // Isso já mostra o erro detalhado no terminal
      res.status(500).json({ erro: "Erro ao cadastrar caminhão.", detalhe: erro });
    });
}


module.exports = {
  listarCaminhoesComAlertas,
  kpiTemperatura,
  kpiUmidade,
  kpiAlertas,
  kpiInformacoes,
  obterDadosGrafico,
  alertasPorDiaSemana,
  alertasPorHoraDia,
  cadastrarCaminhao
};
