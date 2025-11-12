// index.js
// where your node app starts

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Unified handler for /api/timestamp and /api/timestamp/:date?
app.get('/api/timestamp/:date?', (req, res) => {
  const dateParam = req.params.date;

  // No parameter -> fecha actual
  if (!dateParam) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // Detectar si es un número entero (incluye negativo)
  const isNumeric = /^-?\d+$/.test(dateParam);

  let date;
  if (isNumeric) {
    // Si es número, puede venir en segundos (10 dígitos) o ms (13 dígitos)
    // Convertimos a Number y normalizamos a ms
    const num = Number(dateParam);
    if (dateParam.length === 13) {
      date = new Date(num);        // ya está en ms
    } else if (dateParam.length === 10) {
      date = new Date(num * 1000); // segundos -> ms
    } else {
      // Caso general: usar Number como ms (fallback)
      date = new Date(num);
    }
  } else {
    // No numérico: parsear como fecha legible por Date
    date = new Date(dateParam);
  }

  // Validar
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Responder con el formato requerido
  return res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
