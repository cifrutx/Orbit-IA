import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
// Asegúrate de que tienes un index.html en la raíz del proyecto para que esto funcione
app.use(express.static("."));

// Ruta TESS (Transiting Exoplanet Survey Satellite)
app.get("/tess", async (req, res) => {
  const url =
    "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars+where+disc_facility+like+%27%25TESS%25%27+order+by+pl_orbper+desc&format=json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener datos de la NASA (TESS):", error);
    res.status(500).json({ error: "Error al cargar datos de TESS" });
  }
});

// Nueva ruta KOI (Kepler Object of Interest)
app.get("/koi", async (req, res) => {
  const url =
    "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=koi&format=ipac&where=kepoi_name='K00007.01'+OR+kepoi_name='K00742.01'";
  try {
    const response = await fetch(url);
    // KOI devuelve el formato IPAC, que se lee como texto
    const textData = await response.text(); 
    res.send(textData); 
  } catch (error) {
    console.error("Error al obtener datos de la NASA (KOI):", error);
    res.status(500).json({ error: "Error al cargar datos de KOI" });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
