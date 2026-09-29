const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const verificarToken = require('./middleware/auth');

const app = express();

app.use(helmet());

// Render pone un proxy delante: sin esto el rate limit vería una sola IP
app.set('trust proxy', 1);

const corsOptions = {
    origin: [
        'https://bonking14.github.io',
        'http://localhost:4000',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://127.0.0.1:5503',
        'http://localhost:5503'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiados intentos. Espera 15 minutos.' }
});

app.use('/api/auth', limiter);
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'BonCloud API corriendo' });
});

// El simulador logístico calcula en el navegador (js/simulador.js): ya no
// depende de este servidor, así que no hay endpoint /api/simulador.

// Progreso del curso.
// Protegido con JWT: cada usuario solo lee y escribe su propio progreso (el id sale del token,
// no de la URL). Se guarda en memoria, así que se pierde si el servidor se reinicia;
// el frontend usa localStorage como fuente principal hasta que exista una tabla en Postgres.
const dbProgresoMemoria = {};

app.get('/api/progreso', verificarToken, (req, res) => {
  res.json({ ok: true, progreso: dbProgresoMemoria[req.usuario.id] || {} });
});

app.post('/api/progreso', verificarToken, (req, res) => {
  const { progreso } = req.body || {};
  if (!progreso || !Array.isArray(progreso.leccionesCompletadas)) {
    return res.status(400).json({ ok: false, error: 'Formato de progreso inválido.' });
  }
  dbProgresoMemoria[req.usuario.id] = { leccionesCompletadas: progreso.leccionesCompletadas.filter(Number.isInteger) };
  res.json({ ok: true, mensaje: 'Progreso guardado.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
