const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const soapRoutes = require('./modules/soapSearch/soapSearch.routes');
const incidenciaRoutes = require('./modules/formInc/incidencia.routes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/soapsearch', soapRoutes);
app.use('/api/v1/incidencias', incidenciaRoutes);

module.exports = app;
