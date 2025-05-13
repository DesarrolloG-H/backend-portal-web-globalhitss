const { getSoapData } = require('./soapSearch.service');

const obtenerSoapFiles = (req, res) => {
  res.json(getSoapData());
};

module.exports = { obtenerSoapFiles };
