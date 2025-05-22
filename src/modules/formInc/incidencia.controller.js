const incidenciaService = require('./incidencia.service');
const response = require('../../utils/response');
const formatearIncidencias = require('../formInc/utils/formatearIncidencias')

// Reutilizable para tablas simples
const getSimpleTable = (tableName, label) => async (req, res, next) => {
  try {
    const data = await incidenciaService.getAll(tableName);
    response.ok(res, data, `${label} obtenidos correctamente`);
  } catch (err) {
    response.error(res, err);
  }
};

exports.getTipoAfectacion  = getSimpleTable('tipo_afectacion', 'Tipos de afectación');
exports.getBaseDatos       = getSimpleTable('base_datos', 'Bases de datos');
exports.getResponsablesRca = getSimpleTable('responsables_rca', 'Responsables RCA');
exports.getAplicaciones    = getSimpleTable('aplicaciones', 'Aplicaciones');
exports.getPlataformas     = getSimpleTable('plataformas_tecnologicas', 'Plataformas');
exports.getTorres          = getSimpleTable('torres_impactadas', 'Torres');
exports.getAnalistas       = getSimpleTable('analistas', 'Analistas');

exports.getTransacciones = async (req, res) => {
  try {
    const { aplicacion_id } = req.query;
    if (!aplicacion_id) return response.badRequest(res, 'El campo aplicacion_id es requerido');

    const data = await incidenciaService.getTransacciones(aplicacion_id);
    response.ok(res, data, 'Transacciones obtenidas correctamente');
  } catch (err) {
    response.error(res, err);
  }
};

exports.getTiposTransaccion = async (req, res) => {
  try {
    const { aplicacion_id, transaccion_id } = req.query;
    if (!aplicacion_id || !transaccion_id) {
      return response.badRequest(res, 'Faltan parámetros: aplicacion_id y/o transaccion_id');
    }

    const data = await incidenciaService.getTiposTransaccion(aplicacion_id, transaccion_id);
    response.ok(res, data, 'Tipos de transacción obtenidos correctamente');
  } catch (err) {
    response.error(res, err);
  }
};


exports.crearIncidencia = async (req, res) => {
  try {
    const payload = req.body;
    // console.log('📥 Payload recibido en backend:', JSON.stringify(payload, null, 2));
    const result = await incidenciaService.insertarIncidencia(payload);
    response.ok(res, result, 'Incidencia creada correctamente');
  } catch (err) {
    console.error('❌ Error en crearIncidencia:', err); // 👈 Asegúrate de imprimir esto
    response.error(res, err);
  }
};


exports.obtenerIncidencias = async (req, res) => {
  try {
    const data = await incidenciaService.obtenerIncidenciasConTodo();
    response.ok(res, data, 'Incidencias obtenidas correctamente');
  } catch (err) {
    response.error(res, err);
  }
};



exports.getIncidenciasFormateadas = async (req, res) => {
  try {
    const rows = await incidenciaService.obtenerIncidenciasParaFrontend()
    const resultado = formatearIncidencias(rows)
    response.ok(res, resultado, 'Incidencias obtenidas correctamente')
  } catch (err) {
    console.error('Error en getIncidenciasFormateadas:', err)
    response.error(res, err)
  }
}