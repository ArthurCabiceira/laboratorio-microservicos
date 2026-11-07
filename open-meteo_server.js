const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4001;

app.use(express.json());

// Rota GET /clima?lat=...&lon=...
app.get('/clima', async (req, res) => {
  const { lat, lon } = req.query;

  // 1. Validação da presença e formato numérico das coordenadas
  if (!lat || !lon) {
    return res.status(400).json({ 
      erro: "É necessário fornecer os parâmetros 'lat' e 'lon'." 
    });
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  // Valida os intervalos válidos de latitude (-90 a 90) e longitude (-180 a 180)
  if (isNaN(latitude) || latitude < -90 || latitude > 90 ||
      isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ 
      erro: "Coordenadas inválidas. Latitude deve estar entre -90 e 90, e Longitude entre -180 e 180." 
    });
  }

  try {
    // 2. Consulta à API do Open-Meteo pedindo a temperatura atual
    const resposta = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const { temperature, windspeed, weathercode } = resposta.data.current_weather;

    // 3. Retorna o JSON reduzido
    return res.json({
      latitude,
      longitude,
      temperatura: temperature,
      velocidadeVento: windspeed,
      codigoTempo: weathercode
    });
  } catch (erro) {
    return res.status(500).json({ 
      erro: "Erro ao consultar o serviço meteorológico." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});