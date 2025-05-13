const incidenciaService = require('./incidencia.service');
const response = require('../../utils/repsonse');

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
