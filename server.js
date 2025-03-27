const express = require("express");
const cors = require("cors");
const fs = require("fs");
const Papa = require("papaparse");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint para leer el archivo CSV
app.get("/api/files", (req, res) => {
  try {
    const filePath = "./info.csv"; // Ruta al archivo CSV
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parsear CSV a JSON
    const { data } = Papa.parse(fileContent, {
      header: true, // Usa la primera fila como nombres de columnas
      skipEmptyLines: true
    });

    // Filtrar solo las columnas necesarias
    const filteredData = data.map(row => ({
      Nombre_Documento: row["Nombre Documento"],
      Grupo: row["Grupo SOAP"],
      Equipo: row["Equipo SOAP"],
      Tipo_Documento: row["Tipo Documento SOAP"],
      Equipo_Mesa_Agil: row["Equipo Mesa Ágil SOAP"],
      Ruta_archivo: row["Ruta archivo"],
    }));

    res.json(filteredData);
  } catch (error) {
    console.error("Error al procesar el archivo CSV:", error);
    res.status(500).json({ error: "Error al procesar el archivo CSV" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
