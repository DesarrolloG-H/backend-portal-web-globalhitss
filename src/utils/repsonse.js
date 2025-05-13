// Respuesta exitosa
exports.ok = (res, data, message = 'Operación exitosa') => {
  res.status(200).json({
    success: true,
    message,
    data
  });
};

// Error por datos inválidos (400)
exports.badRequest = (res, message = 'Solicitud inválida') => {
  res.status(400).json({
    success: false,
    message
  });
};

// Error interno del servidor (500 u otros)
exports.error = (res, error) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
};
