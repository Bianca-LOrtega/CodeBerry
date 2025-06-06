const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Caminhões com alerta por empresa
router.get('/caminhoes/:cnpjEmpresa', dashboardController.listarCaminhoesComAlertas);
// Kpi
router.get("/alerta-temperatura", dashboardController.alertaTemperatura);
router.get("/lote-em-transito", dashboardController.loteEmTransito);
router.get("/temperatura-caminhao", dashboardController.temperaturaMediaCaminhao);
router.get("/umidade-caminhao", dashboardController.umidadeMediaCaminhao);
// Gráficos

// rota buscarRegistros
router.get("/caminhao/:idCaminhao/registros", dashboardController.registrosCaminhao);
// rota inserir um novo registro


//ROTA DE CADASTRAR CANINHAO
router.post("/caminhao/cadastrar", dashboardController.cadastrarCaminhao);

router.post('/caminhao/cadastrar', dashboardController.cadastrarCaminhao); // cadastrar


module.exports = router;
