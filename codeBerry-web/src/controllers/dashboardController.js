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

async function alertaTemperatura(req, res) {
  try {
    const resultado = await kpiModel.alertaTemperatura();
    res.status(200).json(resultado[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function loteEmTransito(req, res) {
  try {
    const resultado = await kpiModel.loteEmTransito();
    res.status(200).json(resultado[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function temperaturaMediaCaminhao(req, res) {
  try {
    const resultado = await kpiModel.temperaturaMediaCaminhao();
    res.status(200).json(resultado[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function umidadeMediaCaminhao(req, res) {
  try {
    const resultado = await kpiModel.umidadeMediaCaminhao();
    res.status(200).json(resultado[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

function rotaCaminhao(req, res) {
  const { idCaminhao } = req.params;

  dashboardModel.buscarRota(idCaminhao)
    .then(dados => res.status(200).json(dados))
    .catch(err => {
      console.error("Erro ao buscar rota:", err);
      res.status(500).json({ erro: "Erro ao buscar rota" });
    });
}

function registrosCaminhao(req, res) {
  const { idCaminhao } = req.params;

  dashboardModel.registrosCaminhao(idCaminhao)
    .then(registros => res.status(200).json(registros))
    .catch(erro => {
      console.error("Erro ao buscar registros:", erro);
      res.status(500).json({ erro: "Erro ao buscar registros do caminhão" });
    });
}


module.exports = {
  listarCaminhoesComAlertas,
  rotaCaminhao,
  registrosCaminhao,
  obterTemperaturaMedia,
  alertaTemperatura,
  loteEmTransito,
  temperaturaMediaCaminhao,
  umidadeMediaCaminhao
};
