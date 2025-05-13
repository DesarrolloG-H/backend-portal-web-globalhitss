const express = require('express');
const router = express.Router();
const { obtenerSoapFiles } = require('./soapSearch.controller');

router.get('/files', obtenerSoapFiles);

module.exports = router;
