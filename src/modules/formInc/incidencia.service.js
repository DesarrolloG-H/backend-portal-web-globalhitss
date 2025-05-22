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

const insertarBasesDatos = async (conn, incidenciaId, baseDatos) => {
  for (const item of baseDatos) {
    await conn.query(
      `INSERT INTO base_datos_afectadas 
        (incidencia_id, base_datos_id, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?)`,
      [
        incidenciaId,
        item.bd?.id || item.bd,
        item.horaInicioBd,
        item.horaFinBd
      ]
    );
  }
};

const insertarNodos = async (conn, incidenciaId, nodos) => {
  for (const nodo of nodos) {
    await conn.query(
      `INSERT INTO nodos_afectados 
        (incidencia_id, nombre_nodo, ip_nodo, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        nodo.nombreNodo,
        nodo.ipNodo,
        nodo.horaInicioNodo,
        nodo.horaFinNodo
      ]
    );
  }
};

const insertarServicios = async (conn, incidenciaId, servicios) => {
  for (const item of servicios) {
    await conn.query(
      `INSERT INTO servicios_afectados 
        (incidencia_id, nombre_servicio, ip_servicio, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        item.nombreServicio,
        item.ipServicio,
        item.horaInicioServicio,
        item.horaFinServicio
      ]
    );
  }
};

const insertarBalanceadores = async (conn, incidenciaId, balanceadores) => {
  for (const item of balanceadores) {
    await conn.query(
      `INSERT INTO balanceadores_afectados 
        (incidencia_id, nombre_balanceador, ip_balanceador, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        item.nombreBalanceador,
        item.ipBalanceador,
        item.horaInicioBalanceador,
        item.horaFinBalanceador
      ]
    );
  }
};


const insertarServidores = async (conn, incidenciaId, servidores) => {
  for (const item of servidores) {
    await conn.query(
      `INSERT INTO servidores_afectados 
        (incidencia_id, nombre_servidor, ip_servidor, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        item.nombreServidor,
        item.ipServidor,
        item.horaInicioServidor,
        item.horaFinServidor
      ]
    );
  }
};

const insertarTransacciones = async (conn, incidenciaId, transacciones) => {
  for (const item of transacciones) {
    await conn.query(
      `INSERT INTO transacciones_afectadas 
        (incidencia_id, tipo_transaccion_id, plataforma_id, torre_id, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        item.tipoTransaccion,
        item.plataformaAfectada,
        item.torreImpactada,
        item.horaInicioTransaccion,
        item.horaFinTransaccion
      ]
    );
  }
};

const insertarIncidencia = async (data) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insertar en incidencia
    const [resultado] = await conn.query(
      `INSERT INTO incidencia (
        fecha, semana, ticket, tipo_afectacion_id, resumen, impacto,
        origen_evento, aplica_rca, responsable_rca_id,
        acciones_realizadas, solucion, lecciones_aprendidas_url,
        cantidad_tickets, analista_registro_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.datosGenerales.fecha,
        data.datosGenerales.semana,
        data.datosGenerales.ticket,
        data.datosGenerales.tipoAfectacion,
        data.datosGenerales.resumen,
        data.datosGenerales.impacto,
        data.causaRca.origen,
        data.causaRca.aplicaRCA,
        data.causaRca.responsableRca,
        data.gestionEventos.accionesRealizadas,
        data.gestionEventos.solucion,
        data.gestionEventos.leccionesAprendidas,
        data.datosExtra.cantidadTickets,
        data.datosExtra.analistaRegistro
      ]
    );

    const incidenciaId = resultado.insertId;
    
    // 2. Insertar base de datos afectadas (si existen)
    if (Array.isArray(data.baseDatos) && data.baseDatos.length > 0) {
      await insertarBasesDatos(conn, incidenciaId, data.baseDatos);
    }

    // 3. Insertar nodos afectados (si existen)
    if (Array.isArray(data.nodos) && data.nodos.length > 0) {
      await insertarNodos(conn, incidenciaId, data.nodos);
    }

    // 4. Insertar servicios afectados (si existen)
    if (Array.isArray(data.servicios) && data.servicios.length > 0) {
      await insertarServicios(conn, incidenciaId, data.servicios);
    }

    // 4. Insertar balanceadores afectados (si existen)
    if (Array.isArray(data.balanceadores) && data.balanceadores.length > 0) {
      await insertarBalanceadores(conn, incidenciaId, data.balanceadores);
    }

    // 5. Insertar servidores afectados (si existen)
    if (Array.isArray(data.servidores) && data.servidores.length > 0) {
      await insertarServidores(conn, incidenciaId, data.servidores);
    }

    // 6. Insertar transacciones afectadas (obligatorio)
    await insertarTransacciones(conn, incidenciaId, data.transacciones);

    await conn.commit();
    return { incidenciaId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};


const obtenerIncidenciasConTodo = async () => {
  const [rows] = await pool.query(`
    SELECT 
      i.id AS incidencia_id,
      i.fecha,
      i.ticket,
      ta.nombre AS tipo_afectacion,
      i.resumen,
      i.impacto,
      i.origen_evento,
      i.aplica_rca,
      r.nombre AS responsable_rca,
      i.acciones_realizadas,
      i.solucion,
      i.lecciones_aprendidas_url,
      i.cantidad_tickets,
      a.nombre AS analista_registro,

      bd.nombre AS base_datos,
      bda.hora_inicio AS bd_hora_inicio,
      bda.hora_fin AS bd_hora_fin,

      na.nombre_nodo,
      na.ip_nodo,
      na.hora_inicio AS nodo_hora_inicio,
      na.hora_fin AS nodo_hora_fin,

      sa.nombre_servicio,
      sa.ip_servicio,
      sa.hora_inicio AS servicio_hora_inicio,
      sa.hora_fin AS servicio_hora_fin,

      ba.nombre_balanceador,
      ba.ip_balanceador,
      ba.hora_inicio AS balanceador_hora_inicio,
      ba.hora_fin AS balanceador_hora_fin,

      se.nombre_servidor,
      se.ip_servidor,
      se.hora_inicio AS servidor_hora_inicio,
      se.hora_fin AS servidor_hora_fin,

      tt.nombre AS tipo_transaccion,
      t.nombre AS transaccion,
      ap.nombre AS aplicacion,
      pt.nombre AS plataforma,
      tr.nombre AS torre,
      taft.hora_inicio AS transaccion_hora_inicio,
      taft.hora_fin AS transaccion_hora_fin

    FROM incidencia i
    LEFT JOIN tipo_afectacion ta ON i.tipo_afectacion_id = ta.id
    LEFT JOIN responsables_rca r ON i.responsable_rca_id = r.id
    LEFT JOIN analistas a ON i.analista_registro_id = a.id

    LEFT JOIN base_datos_afectadas bda ON bda.incidencia_id = i.id
    LEFT JOIN base_datos bd ON bd.id = bda.base_datos_id

    LEFT JOIN nodos_afectados na ON na.incidencia_id = i.id
    LEFT JOIN servicios_afectados sa ON sa.incidencia_id = i.id
    LEFT JOIN balanceadores_afectados ba ON ba.incidencia_id = i.id
    LEFT JOIN servidores_afectados se ON se.incidencia_id = i.id

    LEFT JOIN transacciones_afectadas taft ON taft.incidencia_id = i.id
    LEFT JOIN tipos_transaccion tt ON taft.tipo_transaccion_id = tt.id
    LEFT JOIN transacciones t ON tt.transaccion_id = t.id
    LEFT JOIN aplicaciones ap ON tt.aplicacion_id = ap.id
    LEFT JOIN plataformas_tecnologicas pt ON taft.plataforma_id = pt.id
    LEFT JOIN torres_impactadas tr ON taft.torre_id = tr.id

    ORDER BY i.id DESC;
  `);
  return rows;
};

const obtenerIncidenciasParaFrontend = async () => {
  const [rows] = await pool.query(`
  SELECT 
    i.id AS incidencia_id,
    i.fecha,
    i.ticket,
    ta.nombre AS tipo_afectacion,
    i.resumen,
    i.impacto,
    i.origen_evento,
    i.aplica_rca,
    r.nombre AS responsable_rca,
    i.acciones_realizadas,
    i.solucion,
    i.lecciones_aprendidas_url,
    i.cantidad_tickets,
    a.nombre AS analista_registro,

    -- Base de datos
    bd.nombre AS base_datos,
    bda.hora_inicio AS bd_hora_inicio,
    bda.hora_fin AS bd_hora_fin,

    -- Nodos
    na.nombre_nodo,
    na.ip_nodo,
    na.hora_inicio AS nodo_hora_inicio,
    na.hora_fin AS nodo_hora_fin,

    -- Servicios
    sa.nombre_servicio,
    sa.ip_servicio,
    sa.hora_inicio AS servicio_hora_inicio,
    sa.hora_fin AS servicio_hora_fin,

    -- Balanceadores
    ba.nombre_balanceador,
    ba.ip_balanceador,
    ba.hora_inicio AS balanceador_hora_inicio,
    ba.hora_fin AS balanceador_hora_fin,

    -- Servidores
    se.nombre_servidor,
    se.ip_servidor,
    se.hora_inicio AS servidor_hora_inicio,
    se.hora_fin AS servidor_hora_fin,

    -- Transacciones
    tt.nombre AS tipo_transaccion,
    t.nombre AS transaccion,
    ap.nombre AS aplicacion,
    pt.nombre AS plataforma,
    tr.nombre AS torre,
    taft.hora_inicio AS transaccion_hora_inicio,
    taft.hora_fin AS transaccion_hora_fin

  FROM incidencia i
  LEFT JOIN tipo_afectacion ta ON i.tipo_afectacion_id = ta.id
  LEFT JOIN responsables_rca r ON i.responsable_rca_id = r.id
  LEFT JOIN analistas a ON i.analista_registro_id = a.id

  LEFT JOIN base_datos_afectadas bda ON bda.incidencia_id = i.id
  LEFT JOIN base_datos bd ON bd.id = bda.base_datos_id

  LEFT JOIN nodos_afectados na ON na.incidencia_id = i.id
  LEFT JOIN servicios_afectados sa ON sa.incidencia_id = i.id
  LEFT JOIN balanceadores_afectados ba ON ba.incidencia_id = i.id
  LEFT JOIN servidores_afectados se ON se.incidencia_id = i.id

  LEFT JOIN transacciones_afectadas taft ON taft.incidencia_id = i.id
  LEFT JOIN tipos_transaccion tt ON taft.tipo_transaccion_id = tt.id
  LEFT JOIN transacciones t ON tt.transaccion_id = t.id
  LEFT JOIN aplicaciones ap ON tt.aplicacion_id = ap.id
  LEFT JOIN plataformas_tecnologicas pt ON taft.plataforma_id = pt.id
  LEFT JOIN torres_impactadas tr ON taft.torre_id = tr.id

  ORDER BY i.id DESC;
  `)
  return rows
}

module.exports = {
  getAll,
  getTransacciones,
  getTiposTransaccion,
  insertarIncidencia,
  obtenerIncidenciasConTodo,
  obtenerIncidenciasParaFrontend,
};