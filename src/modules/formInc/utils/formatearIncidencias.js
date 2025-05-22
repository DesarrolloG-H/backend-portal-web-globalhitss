function formatearIncidencias(rows) {
  const map = new Map()

  for (const row of rows) {
    const id = row.incidencia_id

    if (!map.has(id)) {
      map.set(id, {
        incidenciaId: row.incidencia_id,
        datosGenerales: {
          fecha: row.fecha,
          semana: null, // podrías calcularla en backend si lo deseas
          ticket: row.ticket,
          tipoAfectacion: row.tipo_afectacion,
          resumen: row.resumen,
          impacto: row.impacto,
        },
        baseDatos: [],
        nodos: [],
        servicios: [],
        balanceadores: [],
        servidores: [],
        causaRca: {
          origen: row.origen_evento,
          aplicaRCA: !!row.aplica_rca,
          responsableRca: row.responsable_rca
        },
        transacciones: [],
        gestionEventos: {
          accionesRealizadas: row.acciones_realizadas,
          solucion: row.solucion,
          leccionesAprendidas: row.lecciones_aprendidas_url
        },
        datosExtra: {
          cantidadTickets: row.cantidad_tickets,
          analistaRegistro: row.analista_registro
        }
      })
    }

    const item = map.get(id)

    // Base de Datos
    if (row.base_datos) {
      const yaExiste = item.baseDatos.some(bd => bd.bd?.nombre === row.base_datos)
      if (!yaExiste) {
        item.baseDatos.push({
          bd: { nombre: row.base_datos },
          horaInicioBd: row.bd_hora_inicio,
          horaFinBd: row.bd_hora_fin
        })
      }
    }

    // Nodos
    if (row.nombre_nodo && row.ip_nodo) {
      const yaExiste = item.nodos.some(n => n.nombreNodo === row.nombre_nodo && n.ipNodo === row.ip_nodo)
      if (!yaExiste) {
        item.nodos.push({
          nombreNodo: row.nombre_nodo,
          ipNodo: row.ip_nodo,
          horaInicioNodo: row.nodo_hora_inicio,
          horaFinNodo: row.nodo_hora_fin
        })
      }
    }

    // Servicios
    if (row.nombre_servicio && row.ip_servicio) {
      const yaExiste = item.servicios.some(s => s.nombreServicio === row.nombre_servicio && s.ipServicio === row.ip_servicio)
      if (!yaExiste) {
        item.servicios.push({
          nombreServicio: row.nombre_servicio,
          ipServicio: row.ip_servicio,
          horaInicioServicio: row.servicio_hora_inicio,
          horaFinServicio: row.servicio_hora_fin
        })
      }
    }

    // Balanceadores
    if (row.nombre_balanceador && row.ip_balanceador) {
      const yaExiste = item.balanceadores.some(b => b.nombreBalanceador === row.nombre_balanceador && b.ipBalanceador === row.ip_balanceador)
      if (!yaExiste) {
        item.balanceadores.push({
          nombreBalanceador: row.nombre_balanceador,
          ipBalanceador: row.ip_balanceador,
          horaInicioBalanceador: row.balanceador_hora_inicio,
          horaFinBalanceador: row.balanceador_hora_fin
        })
      }
    }

    // Servidores
    if (row.nombre_servidor && row.ip_servidor) {
      const yaExiste = item.servidores.some(s => s.nombreServidor === row.nombre_servidor && s.ipServidor === row.ip_servidor)
      if (!yaExiste) {
        item.servidores.push({
          nombreServidor: row.nombre_servidor,
          ipServidor: row.ip_servidor,
          horaInicioServidor: row.servidor_hora_inicio,
          horaFinServidor: row.servidor_hora_fin
        })
      }
    }

    // Transacciones (solo una vez)
    if (
      row.tipo_transaccion &&
      !item.transacciones.find(t => t.tipoTransaccion === row.tipo_transaccion)
    ) {
      item.transacciones.push({
        tipoTransaccion: row.tipo_transaccion,
        transaccion: row.transaccion,
        aplicacion: row.aplicacion,
        plataformaAfectada: row.plataforma,
        torreImpactada: row.torre,
        horaInicioTransaccion: row.transaccion_hora_inicio,
        horaFinTransaccion: row.transaccion_hora_fin
      })
    }
  }

  return [...map.values()]
}

module.exports = formatearIncidencias;
