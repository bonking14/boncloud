const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const SYSTEM_PROMPT = `Eres un experto en comercio exterior colombiano y operaciones portuarias del Puerto de Cartagena. 
Tu función es analizar operaciones de importación y generar simulaciones detalladas basadas en la normativa vigente (Decreto 1165/2019, Resolución 046/2019 de la DIAN).

Cuando recibas los datos de una operación, responde ÚNICAMENTE con un JSON válido con esta estructura exacta:

{
  "costos": {
    "flete_internacional_usd": number,
    "seguro_usd": number,
    "valor_cif_usd": number,
    "arancel_cop": number,
    "iva_cop": number,
    "agencia_aduanas_cop": number,
    "almacenaje_estimado_cop": number,
    "total_usd": number,
    "total_cop": number,
    "tasa_cambio_referencia": number
  },
  "timeline": [
    { "etapa": string, "dias_min": number, "dias_max": number, "descripcion": string }
  ],
  "riesgos": [
    { "nivel": "alto"|"medio"|"bajo", "titulo": string, "descripcion": string }
  ],
  "documentos": [
    { "nombre": string, "obligatorio": boolean, "entidad": string }
  ],
  "subpartida_sugerida": string,
  "resumen_ejecutivo": string
}

Reglas:
- Para el arancel usa el arancel colombiano vigente según la subpartida. Si no la conoces con certeza, estima con 5% o 15% según el tipo de bien.
- El IVA de importación es siempre 19% sobre (valor CIF + arancel).
- El seguro estima al 0.5% del valor FOB si no se especifica.
- El flete estima según origen: Asia 2500-4000 USD, Europa 1500-2500 USD, América 500-1500 USD para contenedor 20ft.
- Tasa de cambio de referencia: 4200 COP/USD.
- Los riesgos deben ser específicos a la operación, no genéricos.
- No incluyas texto fuera del JSON. Cero markdown, cero explicaciones.`;

const app = express();

app.use(helmet());

app.use(cors({
    origin: ['https://bonking14.github.io', 'http://localhost:4000', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options(/.*/, cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiados intentos. Espera 15 minutos.' }
});

app.use('/api/auth', limiter);
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'BonCloud API corriendo' });
});

app.post('/api/simulador', async (req, res) => {
  try {
    const operacion = req.body;

    // Lógica hardcodeada (sin Anthropic API)
    const valorUSD = operacion.valor_usd || 10000;
    const fleteUSD = 2500;
    const seguroUSD = valorUSD * 0.005;
    const cifUSD = valorUSD + fleteUSD + seguroUSD;
    const tasaCambio = 4200;
    const arancelCOP = cifUSD * tasaCambio * 0.10; // 10% arancel promedio
    const ivaCOP = (cifUSD * tasaCambio + arancelCOP) * 0.19;
    const agenciaCOP = 1500000;
    const almacenajeCOP = 800000;
    const totalCOP = (cifUSD * tasaCambio) + arancelCOP + ivaCOP + agenciaCOP + almacenajeCOP;

    const resultado = {
      costos: {
        flete_internacional_usd: fleteUSD,
        seguro_usd: seguroUSD,
        valor_cif_usd: cifUSD,
        arancel_cop: arancelCOP,
        iva_cop: ivaCOP,
        agencia_aduanas_cop: agenciaCOP,
        almacenaje_estimado_cop: almacenajeCOP,
        total_usd: cifUSD,
        total_cop: totalCOP,
        tasa_cambio_referencia: tasaCambio
      },
      timeline: [
        { etapa: "Tránsito Internacional", dias_min: 20, dias_max: 35, descripcion: `Transporte marítimo desde ${operacion.pais_origen || 'origen'}` },
        { etapa: "Nacionalización", dias_min: 2, dias_max: 5, descripcion: "Trámites aduaneros DIAN" },
        { etapa: "Retiro y Entrega", dias_min: 1, dias_max: 3, descripcion: "Salida del puerto de Cartagena" }
      ],
      riesgos: [
        { nivel: "medio", titulo: "Fluctuación TRM", descripcion: "La tasa de cambio (TRM) puede variar significativamente al momento de pagar los tributos." },
        { nivel: "bajo", titulo: "Inspección Física", descripcion: "Probabilidad estándar de inspección por parte de las autoridades." }
      ],
      documentos: [
        { nombre: "Factura Comercial", obligatorio: true, entidad: "Vendedor" },
        { nombre: "Documento de Transporte", obligatorio: true, entidad: "Naviera" },
        { nombre: "Lista de Empaque", obligatorio: true, entidad: "Vendedor" },
        { nombre: "Licencia Previa", obligatorio: operacion.licencia_previa, entidad: "VUCE / MINCIT" }
      ],
      subpartida_sugerida: operacion.subpartida || "8479.89.00.00",
      resumen_ejecutivo: `Simulación (Hardcoded) de importación para la mercancía "${operacion.descripcion_mercancia || 'general'}". Los costos son aproximados basados en los datos ingresados y la TRM actual.`
    };

    res.json({ ok: true, resultado });

  } catch (error) {
    console.error('Error simulador:', error);
    res.status(500).json({ ok: false, error: 'Error procesando la simulación' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
