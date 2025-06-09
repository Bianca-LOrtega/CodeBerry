const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/caminhoes/:cnpjEmpresa", dashboardController.listarCaminhoesComAlertas);

router.get("/temperatura-caminhao/:cnpjEmpresa/:idCaminhao", dashboardController.kpiTemperatura);
router.get("/umidade-caminhao/:cnpjEmpresa/:idCaminhao", dashboardController.kpiUmidade);
router.get("/alerta-temperatura/:cnpjEmpresa/:idCaminhao", dashboardController.kpiAlertas);
router.get("/informacoes/:cnpjEmpresa/:idCaminhao", dashboardController.kpiInformacoes);

router.get("/graficos/:cnpj/:idCaminhao", dashboardController.obterDadosGrafico);
router.get("/ultimo-registro/:cnpj/:idCaminhao", dashboardController.ultimosDados);
router.get("/alertas-semana/:cnpj/:idCaminhao", dashboardController.alertasPorDiaSemana);
router.get("/alertas-hora/:cnpj/:idCaminhao", dashboardController.alertasPorHoraDia);

router.post("/caminhao/cadastrar", dashboardController.cadastrarCaminhao);

router.get("/placa-caminhao/:idCaminhao", dashboardController.buscarPlacaCaminhao);

module.exports = router;