const express = require('express');
const router = express.Router();
const incidenciaController = require('./incidencia.controller');

// Rutas para selects del formulario
router.get('/tipo-afectacion', incidenciaController.getTipoAfectacion);
router.get('/base-datos', incidenciaController.getBaseDatos);
router.get('/responsables-rca', incidenciaController.getResponsablesRca);
router.get('/aplicaciones', incidenciaController.getAplicaciones);
router.get('/transacciones', incidenciaController.getTransacciones); // ?aplicacion_id=#
router.get('/tipos-transaccion', incidenciaController.getTiposTransaccion); // ?aplicacion_id=#&transaccion_id=#
router.get('/plataformas', incidenciaController.getPlataformas);
router.get('/torres', incidenciaController.getTorres);
router.get('/analistas', incidenciaController.getAnalistas);

// Rutas para POST
router.post('/formulario', incidenciaController.crearIncidencia);

router.get('/todo', incidenciaController.obtenerIncidencias);
router.get('/data-cargada', incidenciaController.getIncidenciasFormateadas)


module.exports = router;
