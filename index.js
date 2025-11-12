// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// API timestamp

app.get('/api/timestamp', (req, res) => {
  const now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString()
  });
});

// 2️⃣ /api/timestamp/:date → con parámetro (puede ser fecha o unix)
app.get('/api/timestamp/:date', (req, res) => {
  const dateParam = req.params.date;

  // Si el parámetro solo contiene dígitos, interpretarlo como UNIX
  const date = /^\d+$/.test(dateParam)
    ? new Date(parseInt(dateParam))
    : new Date(dateParam);

  // Validar si es fecha válida
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Respuesta correcta
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
