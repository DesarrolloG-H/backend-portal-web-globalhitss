const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
require('dotenv').config();

const filePath = path.resolve(process.env.SOAPSEARCH_CSV_PATH);
let cachedData = [];

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

    console.log("✅ CSV cargado y cacheado.");
  } catch (error) {
    console.error("❌ Error al cargar CSV:", error);
  }
};

// Inicial y watcher
loadCSV();
fs.watchFile(filePath, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log("🔄 CSV actualizado. Recargando...");
    loadCSV();
  }
});

const getSoapData = () => cachedData;

module.exports = { getSoapData };
