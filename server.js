const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Ruta al archivo CSV (formato correcto para Windows)
const filePath = path.resolve("C:/Users/justinianoj/GLOBAL HITSS/Automatizaciones-soap - REVISION/data.csv");

let cachedData = [];

// Configurar CORS para permitir solicitudes desde tu frontend
const corsOptions = {
  origin: 'http://10.172.202.89:5173',  // Permite solicitudes solo desde esta URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Agregar esta línea para habilitar CORS

// Función para cargar el archivo CSV
const loadCSV = () => {
  try {
    console.log("📂 Cargando archivo CSV desde:", filePath);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });

    cachedData = data.map(row => ({
      Nombre_Documento: row["OPERATIVAS[Nombre Documento]"],
      Grupo: row["OPERATIVAS[Grupo SOAP]"],
      Equipo: row["OPERATIVAS[Equipo SOAP]"],
      Tipo_Documento: row["OPERATIVAS[Tipo Documento SOAP]"],
      Equipo_Mesa_Agil: row["OPERATIVAS[Equipo Mesa Ágil SOAP]"],
      Ruta_archivo: row["OPERATIVAS[Ruta archivo]"],
    }));

    console.log("✅ Archivo CSV cargado correctamente.");
  } catch (error) {
    console.error("❌ Error al leer el archivo CSV:", error);
  }
};

// Cargar CSV al iniciar
loadCSV();

// Monitorear cambios en el archivo CSV
fs.watchFile(filePath, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log("🔄 Archivo actualizado. Recargando datos...");
    loadCSV();
  }
});

// Endpoint para servir los datos
app.get("/api/files", (req, res) => {
  res.json(cachedData);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
