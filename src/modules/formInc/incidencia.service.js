const pool = require('../../config/db');

const getAll = async (table) => {
    const [rows] = await pool.query(`SELECT id, nombre FROM ${table}`);
    return rows
};

const getTransacciones = async (aplicacion_id) => {
    const [rows] = await pool.query('SELECT id, nombre FROM transacciones WHERE aplicacion_id = ? ORDER BY nombre', 
        [aplicacion_id]
    );
    return rows;
};

const getTiposTransaccion = async (aplicacion_id, transaccion_id) => {
    const [rows] = await pool.query(`SELECT id, nombre FROM tipos_transaccion WHERE aplicacion_id = ? AND transaccion_id = ? ORDER BY nombre`,
        [aplicacion_id, transaccion_id]
    );
    return rows
}

module.exports = {
  getAll,
  getTransacciones,
  getTiposTransaccion,
};