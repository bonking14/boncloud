/**
 * BonCloud — Ruta de Aprendizaje de Comercio Internacional
 * Archivo de datos de lecciones (cursos.js)
 * Caso único: Importación de 500 bombas hidráulicas desde Shanghái al Puerto de Cartagena.
 * Normativa: Decreto 1165 de 2019 (Régimen Aduanero Colombiano).
 * Marca TODO en cifras y datos sujetos a verificación humana.
 */

const CURSO_LECCIONES = [
  {
    id: 1,
    orden: 1,
    titulo: "¿Qué es el comercio internacional y quiénes intervienen?",
    nivel: "Fundamentos",
    duracionMin: 15,
    objetivos: [
      "Comprender el flujo de una operación de importación en Colombia",
      "Identificar los actores públicos y privados del comercio exterior",
      "Conocer los requisitos iniciales según el Decreto 1165 de 2019"
    ],
    contenido: `
      <p>El <strong>comercio internacional</strong> abarca la compraventa de bienes y servicios entre distintos países. En Colombia, el régimen aduanero está regulado principalmente por el <strong>Decreto 1165 de 2019</strong> y supervisado por la <span class="term-glosario" data-glosario="DIAN">DIAN</span>.</p>
      
      <h4>Actores principales de la cadena:</h4>
      <ul>
        <li><strong>Importador (Comprador):</strong> Persona natural o jurídica que adquiere la mercancía en el exterior. Debe contar con el <span class="term-glosario" data-glosario="Formulario 001">RUT (Formulario 001)</span> habilitado en la casilla 54 como usuario aduanero.</li>
        <li><strong>Exportador (Vendedor):</strong> Proveedor internacional responsable del despacho en origen.</li>
        <li><strong>Agente de Carga Internacional (Freight Forwarder):</strong> Coordina el transporte internacional (marítimo, aéreo o terrestre).</li>
        <li><strong>Agencia de Aduanas (SIA / OEA):</strong> Declarante autorizado que representa al importador ante las autoridades aduaneras.</li>
        <li><strong>Sociedad Portuaria:</strong> Operador logístico portuario (ej. SPRC / CONTECAR en el Puerto de Cartagena).</li>
        <li><strong>Autoridades de Control:</strong> DIAN, Policía Antinarcóticos, INVIMA, ICA, SIC, entre otras.</li>
      </ul>
    `,
    etapaCaso: "Empresa HidroColombia S.A.S. planifica importar 500 bombas hidráulicas de alta presión desde el fabricante Zhejiang Hydraulic Co. en Shanghái. Primer paso: Verificar que el RUT (Formulario 001) tenga activa la responsabilidad de Importador en la DIAN.",
    practica: {
      texto: "Verifica requisitos del Formulario RUT (001)",
      moduloUrl: "formularios.html",
      parametros: { form: "001" }
    },
    quiz: [
      {
        pregunta: "¿Qué norma rige principalmente el régimen aduanero y de desaduanamiento en Colombia?",
        opciones: [
          "Decreto 1165 de 2019",
          "Ley 100 de 1993",
          "Resolución 400 de 2010",
          "Decreto 410 de 1971"
        ],
        correcta: 0,
        explicacion: "El Decreto 1165 de 2019 dicta las disposiciones relativas al régimen de aduanas en el territorio aduanero nacional de Colombia."
      },
      {
        pregunta: "¿Cuál es el requisito indispensable en el RUT (Formulario 001) para poder operar como importador en Colombia?",
        opciones: [
          "Contar con la casilla 54 (Usuario Aduanero - Importador) habilitada ante la DIAN",
          "Tener únicamente cuenta bancaria en el exterior",
          "Pagar el 100% de tributos por anticipado antes de cotizar",
          "No requiere ningún registro previo"
        ],
        correcta: 0,
        explicacion: "Para actuar como declarante o importador ante la DIAN se requiere tener actualizada la responsabilidad como usuario aduanero en el RUT."
      },
      {
        pregunta: "¿Qué función cumple el Agente de Carga Internacional (Freight Forwarder)?",
        opciones: [
          "Coordinar y contratar el transporte internacional de la mercancía",
          "Expedir la factura comercial de venta",
          "Determinar el valor de los impuestos en la DIAN",
          "Realizar la inspección sanitaria de la carga"
        ],
        correcta: 0,
        explicacion: "El Agente de Carga consolida, gestiona y contrata los espacios de flete internacional marítimo o aéreo."
      }
    ]
  },
  {
    id: 2,
    orden: 2,
    titulo: "Incoterms 2020 y cómo elegir uno",
    nivel: "Fundamentos",
    duracionMin: 20,
    objetivos: [
      "Distinguir las responsabilidades entre comprador y vendedor bajo Incoterms 2020",
      "Evaluar las diferencias clave entre los términos FOB, CIF y EXW",
      "Seleccionar el Incoterm más conveniente para la compra en Shanghái"
    ],
    contenido: `
      <p>Los <strong>Incoterms 2020</strong> (International Commercial Terms) publicados por la Cámara de Comercio Internacional (ICC) definen las reglas para la distribución de costos, riesgos y trámites entre comprador y vendedor.</p>
      
      <p>En el transporte marítimo de mercancías desde Asia a Cartagena destacan:</p>
      <ul>
        <li><span class="term-glosario" data-glosario="FOB">FOB (Free On Board):</span> El vendedor entrega a bordo del buque en Shanghái. El comprador contrata el flete marítimo y el seguro internacional.</li>
        <li><span class="term-glosario" data-glosario="CIF">CIF (Cost, Insurance & Freight):</span> El vendedor paga el flete y seguro hasta el Puerto de Cartagena, pero el riesgo se transmite a bordo en Shanghái.</li>
        <li><span class="term-glosario" data-glosario="EXW">EXW (Ex Works):</span> Máxima responsabilidad para el comprador desde la fábrica en origen.</li>
      </ul>
      <!-- TODO: Verificar si la convención cambiaria o cláusulas adicionales afectan la transmisión del riesgo en la póliza -->
    `,
    etapaCaso: "HidroColombia S.A.S. negocia la compra de las 500 bombas hidráulicas a un precio unitario de USD $120.00 bajo el término FOB Shanghái (FOB Total: USD $60,000.00 // TODO: verificar cotización comercial FOB). El riesgo pasa a HidroColombia al momento en que la carga cruza la borda del buque en Shanghái.",
    practica: {
      texto: "Simular y comparar Incoterms 2020 en la guía interactiva",
      moduloUrl: "incoterms.html",
      parametros: { term: "FOB" }
    },
    quiz: [
      {
        pregunta: "En una compra bajo Incoterm FOB Shanghái, ¿quién es responsable de contratar y pagar el flete marítimo internacional hasta Cartagena?",
        opciones: [
          "El comprador (Importador en Colombia)",
          "El vendedor (Proveedor en China)",
          "La DIAN",
          "La Sociedad Portuaria de Cartagena"
        ],
        correcta: 0,
        explicacion: "En FOB (Free On Board), el comprador asume la contratación del flete marítimo y seguro desde el puerto de embarque."
      },
      {
        pregunta: "¿En qué punto exacto se transfiere el riesgo de pérdida o daño en el Incoterm FOB?",
        opciones: [
          "Cuando la mercancía reposa a bordo del buque en el puerto de salida",
          "Cuando llega a la bodega del importador en Bogotá",
          "Al momento de pagar los tributos aduaneros en la DIAN",
          "Al firmar la orden de compra preliminar"
        ],
        correcta: 0,
        explicacion: "El riesgo se transmite del vendedor al comprador una vez la carga es colocada a bordo del buque en Shanghái."
      },
      {
        pregunta: "¿Qué diferencia principal existe entre el Incoterm FOB y el CIF?",
        opciones: [
          "En CIF el vendedor incluye el costo del flete marítimo y el seguro internacional hasta el puerto de destino",
          "FOB solo aplica para transporte aéreo",
          "En CIF el comprador paga todos los gastos en origen",
          "En FOB el vendedor paga los tributos aduaneros en Colombia"
        ],
        correcta: 0,
        explicacion: "CIF (Cost, Insurance and Freight) requiere que el vendedor contrate y pague el transporte y seguro hasta el puerto de destino."
      }
    ]
  },
  {
    id: 3,
    orden: 3,
    titulo: "Clasificación arancelaria y subpartidas",
    nivel: "Intermedio",
    duracionMin: 25,
    objetivos: [
      "Comprender la estructura de la codificación arancelaria NANDINA a 10 dígitos",
      "Determinar la subpartida arancelaria para bombas hidráulicas",
      "Identificar los tributos asociados (Arancel Ad-Valorem e IVA)"
    ],
    contenido: `
      <p>La <strong>clasificación arancelaria</strong> es la asignación de un código numérico estándar a cada mercancía para determinar sus impuestos y requerimientos legales. En Colombia y el bloque andino se utiliza el sistema NANDINA a <strong>10 dígitos</strong>.</p>
      
      <p>Estructura de la subpartida:</p>
      <ul>
        <li><strong>Capítulo (2 dígitos):</strong> 84 — Reactores nucleares, calderas, máquinas, aparatos y artefactos mecánicos.</li>
        <li><strong>Partida (4 dígitos):</strong> 84.13 — Bombas para líquidos, incluso con dispositivo medidor.</li>
        <li><strong>Subpartida del Sistema Armonizado (6 dígitos):</strong> 8413.60 — Las demás bombas volumétricas rotativas.</li>
        <li><strong>Subpartida NANDINA / Arancel Colombiano (10 dígitos):</strong> 8413.60.00.00 // TODO: verificar especificación técnica de pistones vs engranajes.</li>
      </ul>
      <!-- TODO: Verificar si la mercancía goza de preferencia arancelaria bajo algún TLC o acuerdo comercial vigente -->
    `,
    etapaCaso: "Se clasifica el lote de 500 bombas hidráulicas en la subpartida arancelaria 8413.60.00.00. Esta subpartida registra un gravamen arancelario del 5% ad-valorem // TODO: verificar tarifa vigente en arancel de aduanas y está sujeta a la tarifa general de IVA del 19%.",
    practica: {
      texto: "Consultar arancel y requisitos de la subpartida 8413.60.00.00",
      moduloUrl: "subpartidas.html",
      parametros: { buscar: "8413.60.00.00" }
    },
    quiz: [
      {
        pregunta: "¿Cuántos dígitos componen una subpartida arancelaria completa en el Arancel de Aduanas de Colombia (NANDINA)?",
        opciones: [
          "10 dígitos",
          "6 dígitos",
          "4 dígitos",
          "12 dígitos"
        ],
        correcta: 0,
        explicacion: "En Colombia y la Comunidad Andina la nomenclatura arancelaria nacional consta de 10 dígitos exactos."
      },
      {
        pregunta: "¿Para qué sirve clasificar correctamente una mercancía en la subpartida arancelaria?",
        opciones: [
          "Para conocer el porcentaje exacto de arancel, IVA y los vistos buenos requeridos",
          "Únicamente para calcular el peso del contenedor",
          "Para determinar el color del empaque",
          "Para cambiar el Incoterm pactado"
        ],
        correcta: 0,
        explicacion: "La subpartida arancelaria es la llave de entrada aduanera que fija los impuestos y permisos legales exigibles."
      },
      {
        pregunta: "Si una subpartida tiene un acuerdo de TLC aplicable con Certificado de Origen válido, ¿qué ocurre con el arancel?",
        opciones: [
          "Se aplica una desgravación parcial o preferencia del 0% de arancel",
          "Se elimina automáticamente el IVA",
          "No requiere transporte marítimo",
          "Aumenta al doble la tarifa ad-valorem"
        ],
        correcta: 0,
        explicacion: "Los Acuerdos Comerciales (TLC) otorgan preferencias arancelarias que reducen o eliminan el arancel ad-valorem."
      }
    ]
  },
  {
    id: 4,
    orden: 4,
    titulo: "Valor en aduana: FOB, flete, seguro y CIF",
    nivel: "Intermedio",
    duracionMin: 20,
    objetivos: [
      "Determinar la estructura del Valor en Aduana de las mercancías",
      "Calcular el Valor CIF (Cost, Insurance and Freight) en dólares USD",
      "Convertir el Valor CIF a Pesos Colombianos (COP) utilizando la TRM oficial"
    ],
    contenido: `
      <p>Según las normas de valoración de la OMC y la Comunidad Andina, la base para liquidar los impuestos aduaneros en Colombia es el <strong>Valor en Aduana</strong>, equivalente al <strong>Valor CIF</strong> (Costo + Flete + Seguro internacional) entregado en el puerto de ingreso (Cartagena).</p>
      
      <p>Fórmula de cálculo:</p>
      <p style="background: var(--bg-panel); padding: 10px; border-radius: 6px; font-weight: 600; text-align: center;">
        Valor CIF (USD) = Valor FOB + Flete Internacional + Seguro Internacional
      </p>
      <p>Posteriormente, el Valor CIF en USD se multiplica por la <strong>Tasa Representativa del Mercado (TRM)</strong> legalmente vigente en la fecha de presentación y aceptación de la declaración aduanera.</p>
      <!-- TODO: Verificar si existen otros gastos complementarios en origen que deban adicionarse a la DAV (Formulario 560) -->
    `,
    etapaCaso: "Datos del embarque de las 500 bombas hidráulicas:<br>" +
      "• Valor FOB: USD $60,000.00 (500 unidades × $120.00)<br>" +
      "• Flete marítimo Shanghái → Cartagena: USD $3,500.00 // TODO: verificar flete de contenedor de 20 feet<br>" +
      "• Seguro de transporte internacional (0.5% aprox): USD $300.00 // TODO: verificar prima póliza<br>" +
      "• <strong>Valor CIF Total: USD $63,800.00</strong><br>" +
      "• TRM oficial del día: $4,100.00 COP // TODO: verificar TRM vigente para la conversión.",
    practica: {
      texto: "Calcular la base CIF en la Calculadora de Importación",
      moduloUrl: "importacion.html",
      parametros: { fob: 60000, flete: 3500, seguro: 300, trm: 4100 }
    },
    quiz: [
      {
        pregunta: "¿Cuál es la fórmula para obtener el Valor CIF en USD antes de liquidar impuestos aduaneros en Colombia?",
        opciones: [
          "FOB + Flete Internacional + Seguro Internacional",
          "FOB - Descuentos - Fletes",
          "FOB × Tarifa del Arancel",
          "Solo el costo de la factura de compra"
        ],
        correcta: 0,
        explicacion: "El Valor CIF agrupa el valor de la mercancía en origen (FOB), el transporte internacional y la prima de seguro."
      },
      {
        pregunta: "¿Qué tasa de cambio de divisa se debe aplicar para convertir el Valor CIF de USD a COP?",
        opciones: [
          "La Tasa Representativa del Mercado (TRM) oficial a la fecha de presentación y aceptación ante la DIAN",
          "La TRM promedio del año anterior",
          "Una tasa fija pactada con el proveedor",
          "El valor del dólar en casas de cambio locales"
        ],
        correcta: 0,
        explicacion: "La normativa aduanera exige usar la TRM legalmente informada por la Superintendencia Financiera para la fecha de la declaración."
      },
      {
        pregunta: "Si el FOB es USD $60,000, el Flete USD $3,500 y el Seguro USD $300, ¿cuál es el Valor CIF en USD?",
        opciones: [
          "USD $63,800",
          "USD $60,000",
          "USD $63,500",
          "USD $67,000"
        ],
        correcta: 0,
        explicacion: "$60,000 + $3,500 + $300 = $63,800 USD en total."
      }
    ]
  },
  {
    id: 5,
    orden: 5,
    titulo: "Tributos aduaneros: arancel e IVA",
    nivel: "Intermedio",
    duracionMin: 25,
    objetivos: [
      "Calcular el valor del Arancel Ad-Valorem en pesos COP",
      "Determinar la Base Gravable del IVA de importación",
      "Liquidar el monto total de tributos aduaneros a pagar a la DIAN"
    ],
    contenido: `
      <p>Los <strong>Tributos Aduaneros</strong> en Colombia son los gravámenes cobrados al momento de nacionalizar mercancías de origen extranjero. Se componen de:</p>
      
      <ol>
        <li><strong>Arancel (Ad-Valorem):</strong> Se liquida multiplicando el porcentaje de la subpartida por la base CIF expresada en pesos COP.
          <br><code>Arancel (COP) = CIF (COP) × % Arancel</code>
        </li>
        <li><strong>IVA de Importación:</strong> Se calcula sobre la suma del CIF en COP más el Arancel previamente liquidado.
          <br><code>Base IVA (COP) = CIF (COP) + Arancel (COP)</code>
          <br><code>IVA (COP) = Base IVA (COP) × % IVA (Tarifa general 19%)</code>
        </li>
      </ol>
      <p>La suma del <strong>Arancel + IVA</strong> representa la obligación tributaria aduanera a pagar en bancos autorizados antes del levante.</p>
      <!-- TODO: Verificar si la empresa cuenta con saldos a favor de IVA o beneficios de Zona Franca -->
    `,
    etapaCaso: "Liquidación detallada en pesos para el embarque de 500 bombas hidráulicas (TRM $4,100 COP):<br>" +
      "1. CIF en COP: USD $63,800 × $4,100 = <strong>$261,580,000 COP</strong><br>" +
      "2. Arancel (5%): $261,580,000 × 5% = <strong>$13,079,000 COP</strong> // TODO: verificar tarifa arancelaria<br>" +
      "3. Base IVA: $261,580,000 + $13,079,000 = $274,659,000 COP<br>" +
      "4. IVA (19%): $274,659,000 × 19% = <strong>$52,185,210 COP</strong> // TODO: verificar tarifa de IVA<br>" +
      "5. <strong>Total Tributos Aduaneros: $65,264,210 COP</strong>.",
    practica: {
      texto: "Liquidar Arancel e IVA en la Calculadora",
      moduloUrl: "importacion.html",
      parametros: { cifCop: 261580000, arancelPct: 5, ivaPct: 19 }
    },
    quiz: [
      {
        pregunta: "¿Sobre qué base de cálculo se determina el monto del Arancel Ad-Valorem en Colombia?",
        opciones: [
          "Sobre el Valor CIF de la mercancía convertido a pesos (COP)",
          "Sobre el precio de venta en almacenes de Colombia",
          "Únicamente sobre el valor del flete internacional",
          "Sobre el margen de ganancia del importador"
        ],
        correcta: 0,
        explicacion: "El Arancel Ad-Valorem se liquida directamente sobre la base gravable CIF expresada en pesos colombianos."
      },
      {
        pregunta: "¿Cómo se constituye la base gravable para calcular el IVA de importación?",
        opciones: [
          "Sumando el Valor CIF en COP más el monto del Arancel liquidado",
          "Tomando solo el valor FOB en dólares",
          "Restando el flete al valor de la factura",
          "Multiplicando la TRM por el peso bruto"
        ],
        correcta: 0,
        explicacion: "La base gravable del IVA incluye tanto el costo CIF en COP como el gravamen arancelario resultante."
      },
      {
        pregunta: "Si el CIF en COP es $261,580,000 y el Arancel (5%) es $13,079,000, ¿cuál es la base gravable para el IVA?",
        opciones: [
          "$274,659,000 COP",
          "$261,580,000 COP",
          "$13,079,000 COP",
          "$300,000,000 COP"
        ],
        correcta: 0,
        explicacion: "$261,580,000 + $13,079,000 = $274,659,000 COP."
      }
    ]
  },
  {
    id: 6,
    orden: 6,
    titulo: "Vistos buenos y requisitos previos",
    nivel: "Avanzado",
    duracionMin: 20,
    objetivos: [
      "Identificar las autoridades de control técnico y sanitario en Colombia",
      "Entender el funcionamiento de la VUCE (Ventanilla Única de Comercio Exterior)",
      "Gestionar Registros o Licencias de Importación previas a la llegada de la carga"
    ],
    contenido: `
      <p>Ciertas mercancías requieren <strong>Vistos Buenos o Licencias Previas</strong> de entidades especializadas antes de ser embarcadas o nacionalizadas en Colombia, tramitados a través de la <strong>VUCE (Ventanilla Única de Comercio Exterior)</strong> administrada por el Ministerio de Comercio, Industria y Turismo (MinCit).</p>
      
      <p>Principales entidades emisoras de vistos buenos:</p>
      <ul>
        <li><strong>SIC (Superintendencia de Industria y Comercio):</strong> Reglamentos técnicos de etiquetado, seguridad y metrología.</li>
        <li><strong>INVIMA:</strong> Alimentos, medicamentos, cosméticos y equipos médicos.</li>
        <li><strong>ICA:</strong> Productos agrícolas, pecuarios y semillas.</li>
        <li><strong>ANLA:</strong> Licencias ambientales y sustancias químicas.</li>
        <li><strong>Indumil / Fondo Nacional de Estupefacientes:</strong> Armas, explosivos y precursores químicos.</li>
      </ul>
      <!-- TODO: Verificar si el modelo específico de bomba hidráulica requiere certificado RETIE ante la SIC -->
    `,
    etapaCaso: "Antes de despachar el contenedor desde Shanghái, la agencia de aduanas consulta la subpartida 8413.60.00.00 en la VUCE. Se verifica que las bombas hidráulicas requieren registro de reglamento técnico ante la SIC (Superintendencia de Industria y Comercio) // TODO: verificar si exige visto bueno o declaración de conformidad. Se aprueba la solicitud de Registro de Importación electrónico.",
    practica: {
      texto: "Consultar entidades y permisos en la Guía de Vistos Buenos",
      moduloUrl: "vistos-buenos.html",
      parametros: { entidad: "SIC" }
    },
    quiz: [
      {
        pregunta: "¿A través de qué plataforma oficial se tramitan las licencias y registros de importación con vistos buenos en Colombia?",
        opciones: [
          "VUCE (Ventanilla Única de Comercio Exterior)",
          "Página web del Puerto de Cartagena",
          "Correo electrónico directo a la DIAN",
          "Plataforma SWIFT bancaria"
        ],
        correcta: 0,
        explicacion: "La VUCE canaliza los trámites de registro y licencias de importación ante las diferentes entidades de control."
      },
      {
        pregunta: "¿Qué entidad colombiana evalúa el cumplimiento de reglamentos técnicos para maquinaria y aparatos industriales?",
        opciones: [
          "SIC (Superintendencia de Industria y Comercio)",
          "INVIMA",
          "ICA",
          "Banco de la República"
        ],
        correcta: 0,
        explicacion: "La SIC vigila el cumplimiento de los reglamentos técnicos de seguridad, calidad y metrología legal."
      },
      {
        pregunta: "¿En qué momento debe obtenerse un visto bueno de importación cuando es obligatorio?",
        opciones: [
          "Previo al embarque o a la presentación de la declaración de importación",
          "Después de 30 días de vendida la mercancía en Colombia",
          "Únicamente si la DIAN realiza inspección física",
          "No requiere obtenerse en ningún momento"
        ],
        correcta: 0,
        explicacion: "Los vistos buenos y registros de importación deben estar vigentes y aprobados con anterioridad al trámite de desaduanamiento."
      }
    ]
  },
  {
    id: 7,
    orden: 7,
    titulo: "Declaración y formularios DIAN",
    nivel: "Avanzado",
    duracionMin: 30,
    objetivos: [
      "Conocer los formularios aduaneros oficiales de la DIAN",
      "Estructurar el Formulario 500 (Declaración de Importación)",
      "Comprender la Declaración Andina del Valor (DAV - Formulario 560)"
    ],
    contenido: `
      <p>El desaduanamiento formal ante la DIAN exige la elaboración y transmisión electrónica de documentos oficiales bajo el régimen de importación ordinaria:</p>
      
      <ul>
        <li><span class="term-glosario" data-glosario="Formulario 560">Formulario 560 (DAV - Declaración Andina del Valor):</span> Soporta detalladamente los elementos de la transacción comercial (factura, fletes, comisiones, vinculación). Obligatorio para importaciones de valor FOB igual o superior a USD $5,000.</li>
        <li><span class="term-glosario" data-glosario="Formulario 500">Formulario 500 (Declaración de Importación):</span> Documento principal donde se consignan los datos del declarante, la subpartida, la descripción comercial, las bases gravables y la autoliquidación del arancel e IVA.</li>
      </ul>
      <p>Ambos formularios son firmados digitalmente y transmitidos al sistema informático aduanero de la DIAN.</p>
      <!-- TODO: Verificar vigencia de requisitos de firma electrónica e interoperabilidad MUISCA / SYGA -->
    `,
    etapaCaso: "Dado que el valor FOB de las 500 bombas hidráulicas es de USD $60,000 (superior al umbral de USD $5,000), la Agencia de Aduanas diligencia primeramente el Formulario 560 (DAV). Acto seguido, elabora y firma electrónicamente el Formulario 500 con los $65,264,210 COP de tributos autoliquidados.",
    practica: {
      texto: "Diligenciar de prueba el Formulario 500 DIAN",
      moduloUrl: "formularios.html",
      parametros: { form: "500" }
    },
    quiz: [
      {
        pregunta: "¿Qué formulario aduanero oficial se utiliza para declarar la importación y autoliquidar tributos aduaneros en Colombia?",
        opciones: [
          "Formulario 500 (Declaración de Importación)",
          "Formulario 600 (DEX)",
          "Formulario 001 (RUT)",
          "Formulario DTA"
        ],
        correcta: 0,
        explicacion: "El Formulario 500 es la declaración de importación oficial emitida por la DIAN."
      },
      {
        pregunta: "¿A partir de qué valor FOB en dólares es obligatorio diligenciar la Declaración Andina del Valor (DAV - Formulario 560)?",
        opciones: [
          "USD $5,000 FOB",
          "USD $1,000 FOB",
          "USD $10,000 FOB",
          "Para cualquier valor sin mínimo"
        ],
        correcta: 0,
        explicacion: "Las normas andinas establecen la obligación de la DAV para operaciones de importación de USD $5,000 FOB o superior."
      },
      {
        pregunta: "¿Qué información fundamental contiene el Formulario 500 de la DIAN?",
        opciones: [
          "Datos del importador, subpartida, descripción de mercancía, autoliquidación de arancel e IVA",
          "Solamente el número de pasaporte del conductor del camión",
          "La cotización inicial del proveedor sin precios",
          "El menú del comedor del buque marítimo"
        ],
        correcta: 0,
        explicacion: "El Formulario 500 consolida la identificación del usuario, la subpartida, valores CIF, gravámenes e impuestos autoliquidados."
      }
    ]
  },
  {
    id: 8,
    orden: 8,
    titulo: "Nacionalización, levante y retiro en el Puerto de Cartagena",
    nivel: "Avanzado",
    duracionMin: 25,
    objetivos: [
      "Comprender la operativa de recepción en la Sociedad Portuaria de Cartagena (CONTECAR / SPRC)",
      "Distinguir entre Inspección Física, Documental y Levante Automático",
      "Coordinar el retiro de la carga y el transporte hacia la bodega de destino"
    ],
    contenido: `
      <p>Una vez arribado el buque a las instalaciones de la <strong>Sociedad Portuaria de Cartagena (SPRC o CONTECAR)</strong>, la mercancía ingresa al depósito habilitado para su nacionalización.</p>
      
      <h4>Pasos finales del proceso:</h4>
      <ol>
        <li><strong>Pago de tributos:</strong> Cancelación de la declaración (Formulario 500) en entidad bancaria autorizada.</li>
        <li><strong>Determinación de Inspección / Selectividad DIAN:</strong>
          <ul>
            <li><em>Levante Automático:</em> Autorización inmediata de retiro.</li>
            <li><em>Inspección Documental:</em> Revisión de facturas, B/L, registros VUCE por un inspector DIAN.</li>
            <li><em>Inspección Física:</em> Verificación presencial del contenedor en el puerto.</li>
          </ul>
        </li>
        <li><strong>Pago de servicios portuarios:</strong> Muellaje, bodegajes y manipulación en puerto.</li>
        <li><strong>Retiro e Ingreso a Bodega:</strong> Generación del pase de salida y despacho terrestre.</li>
      </ol>
      <!-- TODO: Verificar tarifas de bodegaje libre (días de franquicia) según terminal portuario -->
    `,
    etapaCaso: "El contenedor con las 500 bombas hidráulicas desembarca en el terminal CONTECAR de Cartagena. Tras el pago de $65,264,210 COP en tributos, el sistema de la DIAN asigna Levante Automático. Se cancela la factura de bodegajes portuarios por $450,000 COP // TODO: verificar tarifa de almacenaje. El camión retira el contenedor puerto afuera rumbo a la bodega en Colombia.",
    practica: {
      texto: "Simular tiempos, bodegajes y riesgos en el Puerto de Cartagena",
      moduloUrl: "simulador.html",
      parametros: { puerto: "Cartagena", operacion: "Importacion" }
    },
    quiz: [
      {
        pregunta: "¿Qué tipo de selectividad aduanera otorga autorización inmediata para retirar la mercancía del puerto sin revisión previa?",
        opciones: [
          "Levante Automático",
          "Inspección Física Presencial",
          "Inspección Documental",
          "Aprehensión Cautelar"
        ],
        correcta: 0,
        explicacion: "El Levante Automático es la conformidad otorgada por el sistema aduanero permitiendo la disposición inmediata de la carga."
      },
      {
        pregunta: "En el Puerto de Cartagena (SPRC/CONTECAR), ¿qué trámite es indispensable para retirar físicamente el contenedor?",
        opciones: [
          "Obtener el levante de la DIAN y cancelar los servicios de bodegaje y manipulación portuaria",
          "Volver a embarcar la mercancía hacia otro buque",
          "No requiere pago de bodegaje en ningún caso",
          "Solicitar un nuevo RUT"
        ],
        correcta: 0,
        explicacion: "Para la salida del terminal portuario se exige el acto administrativo de levante DIAN y la cancelación de gastos de puerto."
      },
      {
        pregunta: "Si la DIAN determina Inspección Física en puerto, ¿qué se verifica?",
        opciones: [
          "La correspondencia exacta entre la mercancía física del contenedor y los documentos declarados",
          "El color del buque marítimo únicamente",
          "El estado de salud del Capitán del buque",
          "La cotización del dólar del próximo año"
        ],
        correcta: 0,
        explicacion: "La inspección física consiste en el reconocimiento de la naturaleza, cantidad, peso y subpartida de las mercancías en puerto."
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CURSO_LECCIONES };
}
