const glosario = [
  {
    termino: "DIAN",
    nombreCompleto: "Dirección de Impuestos y Aduanas Nacionales",
    categoria: "Entidades",
    definicion: "Autoridad tributaria y aduanera de Colombia. Controla la entrada y salida de mercancías, recauda los tributos aduaneros, aplica la gestión de riesgo (levante automático o inspección) y sanciona las infracciones.",
    ejemplo: "En la importación de las bombas, la DIAN recibe la declaración de importación, verifica el pago del arancel y el IVA, y otorga el levante.",
    relacionado: ["Formulario 500", "Levante de Mercancía", "Nacionalización"],
    moduloBonCloud: "formularios.html"
  },
  {
    termino: "CIF",
    nombreCompleto: "Cost, Insurance and Freight",
    categoria: "Incoterms",
    definicion: "El vendedor paga el flete y un seguro de cobertura mínima hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía queda a bordo en origen. En Colombia el valor en aduana, base de los tributos, equivale en la práctica a un valor CIF.",
    ejemplo: "Si compras CIF Cartagena por USD 10.000, ese precio ya incluye flete y seguro: no se vuelven a sumar para calcular el arancel y el IVA.",
    relacionado: ["FOB", "CFR", "Base Arancelaria", "Valor en Aduana"],
    moduloBonCloud: "incoterms.html"
  },
  {
    termino: "FOB",
    nombreCompleto: "Free On Board",
    categoria: "Incoterms",
    definicion: "El vendedor entrega la mercancía, despachada para exportación, a bordo del buque designado por el comprador en el puerto de embarque. Desde que está a bordo, el riesgo y el flete internacional son del comprador. Es una regla solo para transporte marítimo o fluvial; para contenedores la ICC recomienda FCA.",
    ejemplo: "Al comprar FOB Shanghai, tú como importador en Colombia contratas y pagas el flete marítimo hasta Cartagena.",
    relacionado: ["CIF", "CFR", "EXW"],
    moduloBonCloud: "incoterms.html"
  },
  {
    termino: "EXW",
    nombreCompleto: "Ex Works (En Fábrica)",
    categoria: "Incoterms",
    definicion: "El vendedor pone la mercancía a disposición del comprador en sus propias instalaciones. El comprador asume todos los costos y riesgos desde la fábrica de origen.",
    ejemplo: "Comprar EXW en Stuttgart implica gestionar la recogida en fábrica, aduana de salida en Alemania y transporte internacional.",
    relacionado: ["FOB", "DDP", "Incoterms"],
    moduloBonCloud: "incoterms.html"
  },
  {
    termino: "DDP",
    nombreCompleto: "Delivered Duty Paid (Entregado Derechos Pagados)",
    categoria: "Incoterms",
    definicion: "El vendedor asume la máxima responsabilidad: transporte, seguro, desaduanamiento de importación y pago de tributos aduaneros en el destino.",
    ejemplo: "Con DDP Bogotá, el proveedor internacional paga el arancel e IVA en la DIAN y entrega en tu bodega.",
    relacionado: ["EXW", "CIF", "Nacionalización"],
    moduloBonCloud: "incoterms.html"
  },
  {
    termino: "CFR",
    nombreCompleto: "Cost and Freight (Costo y Flete)",
    categoria: "Incoterms",
    definicion: "El vendedor paga el transporte marítimo hasta el puerto de destino, pero el riesgo de pérdida se transmite al comprador cuando la carga se embarca.",
    ejemplo: "Si compras CFR Cartagena, el vendedor paga el barco, pero debes contratar una póliza de seguro de transporte independientemente.",
    relacionado: ["CIF", "FOB"],
    moduloBonCloud: "incoterms.html"
  },
  {
    termino: "DTA",
    nombreCompleto: "Declaración de Tránsito Aduanero",
    categoria: "Formularios DIAN",
    definicion: "Declaración con la que la mercancía se traslada bajo control aduanero de una aduana a otra dentro del país, con los tributos suspendidos mientras dura el tránsito.",
    ejemplo: "Un contenedor que llega al Puerto de Cartagena pero se declarará en la aduana de Medellín viaja en tránsito aduanero, amparado por la DTA.",
    relacionado: ["Nacionalización", "Zona Franca", "Formulario 500"],
    moduloBonCloud: "formularios.html"
  },
  {
    termino: "Formulario 500",
    nombreCompleto: "Declaración de Importación DIAN",
    categoria: "Formularios DIAN",
    definicion: "Formulario oficial en el que el declarante liquidará los tributos aduaneros (arancel, IVA) y formalizará el régimen de importación de mercancías.",
    ejemplo: "Antes de retirar la mercancía de la sociedad portuaria se presenta y paga el Formulario 500 ante la DIAN.",
    relacionado: ["Base Arancelaria", "Levante de Mercancía", "Formulario 560"],
    moduloBonCloud: "formularios/form-500-importacion.html"
  },
  {
    termino: "Formulario 600",
    nombreCompleto: "Declaración de Exportación (DEX)",
    categoria: "Formularios DIAN",
    definicion: "Documento aduanero emitido por la DIAN para amparar la salida definitiva o temporal de mercancías del territorio aduanero nacional.",
    ejemplo: "El exportador de café en Cartagena requiere presentar el Formulario 600 DEX para legalizar el despacho al exterior.",
    relacionado: ["Subpartida Arancelaria", "Vistos Buenos"],
    moduloBonCloud: "formularios/form-600-exportacion.html"
  },
  {
    termino: "Formulario 560",
    nombreCompleto: "Declaración Andina del Valor (DAV)",
    categoria: "Formularios DIAN",
    definicion: "Documento obligatorio que soporta la determinación del valor en aduana de las mercancías importadas conforme a las normas de la CAN y la OMC.",
    ejemplo: "Si el valor FOB de la importación es igual o superior a USD 5.000, se presenta la DAV detallando precio, fletes, seguros, comisiones, descuentos y la posible vinculación entre comprador y vendedor.",
    relacionado: ["Formulario 500", "Base Arancelaria", "CIF"],
    moduloBonCloud: "formularios/form-560-dav.html"
  },
  {
    termino: "Formulario 001",
    nombreCompleto: "Registro Único Tributario (RUT)",
    categoria: "Formularios DIAN",
    definicion: "Mecanismo administrado por la DIAN para identificar, ubicar y clasificar a las personas y entidades sujetas a obligaciones tributarias y aduaneras.",
    ejemplo: "Para importar, el RUT debe tener registrada la calidad de usuario aduanero de importador.",
    relacionado: ["NIT", "DV"],
    moduloBonCloud: "formularios/form-001-rut.html"
  },
  {
    termino: "DV",
    nombreCompleto: "Dígito de Verificación",
    categoria: "Identificación Tributaria",
    definicion: "Dígito calculado mediante un algoritmo matemático a partir del NIT, que valida la autenticidad e integridad del número tributario.",
    ejemplo: "Para el NIT 900123456 el sistema asigna el DV 7, resultando en 900123456-7.",
    relacionado: ["NIT", "Formulario 001"],
    moduloBonCloud: "formularios/form-001-rut.html"
  },
  {
    termino: "NIT",
    nombreCompleto: "Número de Identificación Tributaria",
    categoria: "Identificación Tributaria",
    definicion: "Número asignado por la DIAN que permite la individualización inequívoca de los contribuyentes y usuarios aduaneros en Colombia.",
    ejemplo: "Las agencias de aduanas y empresas importadoras registran su NIT en todos los trámites del VUCE y la DIAN.",
    relacionado: ["DV", "Formulario 001"],
    moduloBonCloud: "formularios/form-001-rut.html"
  },
  {
    termino: "Subpartida Arancelaria",
    nombreCompleto: "Código de Nomenclatura del Sistema Armonizado",
    categoria: "Arancel y Clasificación",
    definicion: "Código numérico de 10 dígitos (en el arancel colombiano NANDINA) que identifica una mercancía específica para determinar sus tributos y requisitos.",
    ejemplo: "La subpartida 0901.11.00.00 corresponde al café verde sin tostar ni descafeinar.",
    relacionado: ["Base Arancelaria", "Vistos Buenos", "TLC"],
    moduloBonCloud: "subpartidas.html"
  },
  {
    termino: "Base Arancelaria",
    nombreCompleto: "Base Gravable Aduanera",
    categoria: "Tributos Aduaneros",
    definicion: "Valor total en pesos colombianos (COP) sobre el cual se aplican los porcentajes de arancel e IVA. Se determina convirtiendo el valor CIF en USD a COP mediante la TRM.",
    ejemplo: "Un valor CIF de USD $10,000 a TRM $4,200 genera una base arancelaria de $42,000,000 COP.",
    relacionado: ["CIF", "TRM", "Arancel (Ad-Valorem)", "IVA de Importación"],
    moduloBonCloud: "importacion.html"
  },
  {
    termino: "Arancel (Ad-Valorem)",
    nombreCompleto: "Impuesto a la Importación de Mercancías",
    categoria: "Tributos Aduaneros",
    definicion: "Gravamen aduanero expresado en porcentaje que se cobra sobre la base gravable CIF para autorizar el ingreso de productos al mercado nacional.",
    ejemplo: "Si la subpartida de calzado paga el 35% de arancel, sobre una base CIF de $10.000.000 COP se liquidarán $3.500.000 COP de arancel.",
    relacionado: ["Base Arancelaria", "IVA de Importación", "TLC"],
    moduloBonCloud: "importacion.html"
  },
  {
    termino: "IVA de Importación",
    nombreCompleto: "Impuesto al Valor Agregado en Aduana",
    categoria: "Tributos Aduaneros",
    definicion: "Impuesto indirecto nacional (generalmente del 19%) calculado sobre la suma de la base arancelaria en COP más el valor liquidado del arancel.",
    ejemplo: "Base CIF $42,000,000 COP + Arancel $4,200,000 COP = $46,200,000 COP. El IVA del 19% será de $8,778,000 COP.",
    relacionado: ["Base Arancelaria", "Arancel (Ad-Valorem)", "Formulario 500"],
    moduloBonCloud: "importacion.html"
  },
  {
    termino: "TRM",
    nombreCompleto: "Tasa Representativa del Mercado",
    categoria: "Financiero y Aduanero",
    definicion: "Tasa de cambio peso–dólar que certifica diariamente la Superintendencia Financiera. Para liquidar tributos aduaneros se usa la TRM vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración.",
    ejemplo: "Si la declaración se presenta un miércoles, se usa la TRM vigente el viernes hábil de la semana anterior, no la del miércoles.",
    relacionado: ["Base Arancelaria", "CIF"],
    moduloBonCloud: "importacion.html"
  },
  {
    termino: "Vistos Buenos",
    nombreCompleto: "Permisos y Licencias de Requisito Previo",
    categoria: "Control Aduanero",
    definicion: "Autorizaciones emitidas por entidades estatales sanitarias, ambientales o de seguridad para permitir la importación o exportación de ciertos bienes.",
    ejemplo: "Los productos agropecuarios exigen visto bueno del ICA, mientras que medicamentos y cosméticos requieren visto bueno del INVIMA.",
    relacionado: ["INVIMA", "ICA", "Subpartida Arancelaria"],
    moduloBonCloud: "vistos-buenos.html"
  },
  {
    termino: "INVIMA",
    nombreCompleto: "Instituto Nacional de Vigilancia de Medicamentos y Alimentos",
    categoria: "Entidades Regulatorias",
    definicion: "Entidad del estado colombiano encargada de la vigilancia sanitaria y el otorgamiento de registros/vistos buenos para alimentos, medicinas y cosméticos.",
    ejemplo: "La importación de suplementos dietarios requiere un Registro Sanitario INVIMA vigente antes de ingresar al país.",
    relacionado: ["Vistos Buenos", "ICA"],
    moduloBonCloud: "vistos-buenos.html"
  },
  {
    termino: "ICA",
    nombreCompleto: "Instituto Colombiano Agropecuario",
    categoria: "Entidades Regulatorias",
    definicion: "Entidad responsable de controlar la sanidad animal y vegetal en Colombia para prevenir plagas y enfermedades en el comercio exterior agropecuario.",
    ejemplo: "La importación de frutas frescas requiere un Documento Zoosanitario/Fitosantario de Importación expedido por el ICA.",
    relacionado: ["Vistos Buenos", "INVIMA"],
    moduloBonCloud: "vistos-buenos.html"
  },
  {
    termino: "BL",
    nombreCompleto: "Bill of Lading (Conocimiento de Embarque)",
    categoria: "Documentos de Transporte",
    definicion: "Documento emitido por la naviera o transporte marítimo que acredita el contrato de flete, la recepción de la carga y el título de propiedad de las mercancías.",
    ejemplo: "El consignatario debe presentar el BL original o endosado para solicitar la entrega del contenedor en el Puerto de Cartagena.",
    relacionado: ["AWB", "CIF", "Formulario 500"],
    moduloBonCloud: "simulador.html"
  },
  {
    termino: "AWB",
    nombreCompleto: "Air Waybill (Guía Aérea)",
    categoria: "Documentos de Transporte",
    definicion: "Documento equivalente al BL utilizado exclusivamente en transporte aéreo de carga, que actúa como recibo y contrato de transporte no negociable.",
    ejemplo: "En despachos urgentes por avión vía El Dorado o Rafael Núñez se utiliza una guía aérea AWB máster y fianza de aerolínea.",
    relacionado: ["BL", "CIF"],
    moduloBonCloud: "simulador.html"
  },
  {
    termino: "Nacionalización",
    nombreCompleto: "Desaduanamiento y Libre Disposición",
    categoria: "Operativa Aduanera",
    definicion: "Proceso legal y administrativo mediante el cual se presentan declaraciones, pagan tributos y obtienen autorizaciones para disponer libremente de la mercancía.",
    ejemplo: "Tras pagar la declaración 500 e inspeccionar la carga, se completa la nacionalización permitiendo el traslado nacional.",
    relacionado: ["Levante de Mercancía", "Formulario 500", "Base Arancelaria"],
    moduloBonCloud: "importacion.html"
  },
  {
    termino: "Levante de Mercancía",
    nombreCompleto: "Autorización de Retiro Aduanero DIAN",
    categoria: "Operativa Aduanera",
    definicion: "Acto por el cual la DIAN autoriza disponer de la mercancía declarada. Puede ser automático (sin inspección) o darse después de una inspección documental o física.",
    ejemplo: "Si el sistema de gestión de riesgo no selecciona la declaración para inspección, se otorga levante automático; si ordena inspección física, el levante llega cuando el inspector confirma que la mercancía coincide con lo declarado.",
    relacionado: ["Nacionalización", "Inspección Física (Aduanera)"],
    moduloBonCloud: "formularios/form-500-importacion.html"
  },
  {
    termino: "Inspección Física (Aduanera)",
    nombreCompleto: "Aforo y Verificación Física de Mercancías",
    categoria: "Control Aduanero",
    definicion: "Diligencia mediante la cual el inspector de aduanas examina físicamente la mercancía para verificar peso, cantidad, descripción y subpartida.",
    ejemplo: "Si la DIAN ordena inspección física en el puerto de Cartagena, se programa la revisión del contenedor; también puede hacerse de forma no intrusiva, con escáner.",
    relacionado: ["Levante de Mercancía", "Formulario 500"],
    moduloBonCloud: "formularios/form-500-importacion.html"
  },
  {
    termino: "Zona Franca",
    nombreCompleto: "Área Delimitada con Régimen Tributario Especial",
    categoria: "Regímenes Especiales",
    definicion: "Extensión de territorio nacional con beneficios tributarios, aduaneros y de comercio exterior donde las mercancías no se consideran en el territorio aduanero nacional.",
    ejemplo: "Mercancía ingresada a la Zona Franca Parque Central de Cartagena no paga arancel ni IVA hasta que no ingrese al resto del país.",
    relacionado: ["DTA", "Nacionalización"],
    moduloBonCloud: "simulador.html"
  },
  {
    termino: "TLC",
    nombreCompleto: "Tratado de Libre Comercio",
    categoria: "Acuerdos Comerciales",
    definicion: "Acuerdo vinculante entre dos o más países para conceder preferencias arancelarias recíprocas y reducir barreras al comercio de bienes y servicios.",
    ejemplo: "Con el TLC Colombia - Estados Unidos, muchas partidas de maquinaria ingresan con 0% de arancel mediante certificado de origen.",
    relacionado: ["Subpartida Arancelaria", "Arancel (Ad-Valorem)"],
    moduloBonCloud: "subpartidas.html"
  }
];

let categoriaActiva = 'TODAS';
let textoBusqueda = '';

document.addEventListener('DOMContentLoaded', () => {
  initGlosario();
});

function initGlosario() {
  renderFiltrosCategorias();
  renderTarjetas();
  setupListeners();
}

function renderFiltrosCategorias() {
  const contFiltros = document.getElementById('filtros-categorias');
  if (!contFiltros) return;

  const categorias = ['TODAS', ...new Set(glosario.map(item => item.categoria))];

  contFiltros.innerHTML = categorias.map(cat => `
    <button class="filtro-btn ${cat === categoriaActiva ? 'active' : ''}" data-cat="${cat}">
      ${cat}
    </button>
  `).join('');
}

function getGlosarioFiltrado() {
  return glosario.filter(item => {
    const coincideCat = categoriaActiva === 'TODAS' || item.categoria === categoriaActiva;

    const query = textoBusqueda.toLowerCase().trim();
    if (!query) return coincideCat;

    const coincideTermino = item.termino.toLowerCase().includes(query);
    const coincideNombre = item.nombreCompleto.toLowerCase().includes(query);
    const coincideDefinicion = item.definicion.toLowerCase().includes(query);
    const coincideEjemplo = item.ejemplo.toLowerCase().includes(query);
    const coincideRelacionado = item.relacionado.some(r => r.toLowerCase().includes(query));

    return coincideCat && (coincideTermino || coincideNombre || coincideDefinicion || coincideEjemplo || coincideRelacionado);
  });
}

function renderTarjetas() {
  const grid = document.getElementById('glosario-grid');
  const totalRes = document.getElementById('total-resultados');
  const sinResultados = document.getElementById('sin-resultados');
  if (!grid) return;

  const filtrados = getGlosarioFiltrado();

  if (totalRes) {
    totalRes.textContent = `Mostrando ${filtrados.length} de ${glosario.length} términos`;
  }

  if (filtrados.length === 0) {
    grid.innerHTML = '';
    if (sinResultados) sinResultados.style.display = 'block';
    return;
  }

  if (sinResultados) sinResultados.style.display = 'none';

  grid.innerHTML = filtrados.map(item => `
    <div class="glosario-card" onclick="abrirModalGlosario('${item.termino.replace(/'/g, "\\'")}')">
      <div class="glosario-card-header">
        <span class="glosario-badge">${item.categoria}</span>
        <h3 class="glosario-card-title">${item.termino}</h3>
      </div>
      <p class="glosario-card-sub">${item.nombreCompleto}</p>
      <p class="glosario-card-desc">${item.definicion}</p>
      <div class="glosario-card-footer">
        <span>Ver más detalle ➔</span>
      </div>
    </div>
  `).join('');
}

function setupListeners() {
  const buscador = document.getElementById('buscador');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const contFiltros = document.getElementById('filtros-categorias');
  const modalClose = document.getElementById('glosario-modal-close');
  const modalOverlay = document.getElementById('glosario-modal-overlay');

  if (buscador) {
    buscador.addEventListener('input', (e) => {
      textoBusqueda = e.target.value;
      renderTarjetas();
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      if (buscador) buscador.value = '';
      textoBusqueda = '';
      renderTarjetas();
    });
  }

  if (contFiltros) {
    contFiltros.addEventListener('click', (e) => {
      if (e.target.classList.contains('filtro-btn')) {
        categoriaActiva = e.target.getAttribute('data-cat');
        renderFiltrosCategorias();
        renderTarjetas();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', cerrarModalGlosario);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) cerrarModalGlosario();
    });
  }
}

function abrirModalGlosario(terminoNombre) {
  const item = glosario.find(g => g.termino.toLowerCase() === terminoNombre.toLowerCase());
  if (!item) return false;

  const modalOverlay = document.getElementById('glosario-modal-overlay');
  const contenido = document.getElementById('glosario-modal-contenido');
  if (!modalOverlay || !contenido) return false;

  const relacionadosHTML = item.relacionado.map(rel => `
    <span class="relacionado-tag" onclick="filtrarPorRelacionado('${rel.replace(/'/g, "\\'")}')">${rel}</span>
  `).join(' ');

  contenido.innerHTML = `
    <div class="glosario-detail">
      <span class="glosario-badge">${item.categoria}</span>
      <h2 style="margin: 0.5rem 0 0.25rem; font-size: 1.8rem; color: var(--text-primary);">${item.termino}</h2>
      <h4 style="margin-bottom: 1rem; color: var(--text-muted); font-weight: 500;">${item.nombreCompleto}</h4>

      <div class="detail-section" style="margin-bottom: 1.25rem;">
        <h5 style="margin-bottom: 0.4rem; font-size: 0.95rem; color: var(--text-muted);">📖 Definición Técnica</h5>
        <p style="line-height: 1.6; color: var(--text-secondary); font-size: 1rem;">${item.definicion}</p>
      </div>

      <div class="detail-section" style="margin-bottom: 1.25rem; background: var(--bg-card); padding: 0.85rem 1rem; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <h5 style="margin-bottom: 0.3rem; font-size: 0.95rem; color: var(--text-accent);">💡 Ejemplo en la Práctica</h5>
        <p style="line-height: 1.5; color: var(--text-primary); font-size: 0.95rem; margin: 0;">${item.ejemplo}</p>
      </div>

      <div class="detail-section" style="margin-bottom: 1.5rem;">
        <h5 style="margin-bottom: 0.5rem; font-size: 0.95rem; color: var(--text-muted);">🔗 Términos Relacionados</h5>
        <div>${relacionadosHTML}</div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem;">
        <a href="${item.moduloBonCloud}" class="btn-modulo-link" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #2563eb; color: #ffffff; padding: 0.6rem 1.2rem; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.95rem;">
          🧮 Abrir en el Módulo Real
        </a>
      </div>
    </div>
  `;

  modalOverlay.style.display = 'flex';
  return true;
}

function cerrarModalGlosario() {
  const modalOverlay = document.getElementById('glosario-modal-overlay');
  if (modalOverlay) modalOverlay.style.display = 'none';
}

function filtrarPorRelacionado(terminoRel) {
  cerrarModalGlosario();
  const buscador = document.getElementById('buscador');
  if (buscador) buscador.value = terminoRel;
  textoBusqueda = terminoRel;
  renderTarjetas();
}
