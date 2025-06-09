const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Listar caminhões dashboard.html
router.get('/caminhoes/:cnpjEmpresa', dashboardController.listarCaminhoesComAlertas);
// Kpis
router.get("/temperatura-caminhao/:cnpjEmpresa/:idCaminhao", dashboardController.kpiTemperatura);
router.get("/umidade-caminhao/:cnpjEmpresa/:idCaminhao", dashboardController.kpiUmidade);
router.get("/alerta-temperatura/:cnpjEmpresa/:idCaminhao", dashboardController.kpiAlertas);
router.get("/informacoes/:cnpjEmpresa/:idCaminhao", dashboardController.kpiInformacoes);
// Gráficos
router.get("/graficos/:cnpj/:idCaminhao", dashboardController.obterDadosGrafico);
router.get("/ultimo-registro/:cnpj/:idCaminhao", dashboardController.ultimosDados);
router.get("/alertas-semana/:cnpj/:idCaminhao", dashboardController.alertasPorDiaSemana);
router.get("/alertas-hora/:cnpj/:idCaminhao", dashboardController.alertasPorHoraDia);

//ROTA DE CADASTRAR CAMINHAO
router.post("/caminhao/cadastrar", dashboardController.cadastrarCaminhao);

module.exports = router;
