const subpartidas = [
  {
    codigo: '0901.11.00.00', titulo: 'Café sin tostar, sin descafeinar',
    desc: 'Café verde o en cereza, sin proceso de tostión. Principal producto de exportación colombiana.',
    seccion: 'Alimentaria', arancel: 0, iva: 19,
    keywords: ['cafe', 'coffee', 'grano', 'verde'],
    vistoBueno: ['FNC — Federación Nacional de Cafeteros'],
    documentos: ['Certificado de origen FNC', 'Registro de exportador cafetero', 'Análisis de calidad'],
    notas: 'Colombia exporta café bajo cuota y libre. Para muestras sin valor comercial se requiere autorización FNC.'
  },
  {
    codigo: '6403.99.00.00', titulo: 'Calzado con suela de caucho y parte superior de cuero',
    desc: 'Zapatos, botas y similares con suela de goma o caucho y capellada de cuero natural.',
    seccion: 'Calzado y textiles', arancel: 35, iva: 19,
    keywords: ['zapatos', 'calzado', 'botas', 'cuero', 'leather'],
    vistoBueno: ['SIC — Reglamento técnico si aplica'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Declaración de importación'],
    notas: 'Arancel del 35% aplicado para proteger la industria nacional de calzado.'
  },
  {
    codigo: '8471.30.00.00', titulo: 'Computadores portátiles (laptops)',
    desc: 'Máquinas automáticas para tratamiento de información, portátiles, con peso inferior a 10 kg.',
    seccion: 'Electrónica', arancel: 0, iva: 19,
    keywords: ['computador', 'laptop', 'portatil', 'notebook', 'pc'],
    vistoBueno: ['SIC — Reglamento técnico RETIE/RETILAP si aplica'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Certificado de conformidad SIC'],
    notas: 'Arancel 0% por acuerdo CAN. IVA del 19% aplica en Colombia.'
  },
  {
    codigo: '8517.12.00.00', titulo: 'Teléfonos celulares y smartphones',
    desc: 'Aparatos telefónicos para redes celulares u otras redes inalámbricas.',
    seccion: 'Electrónica', arancel: 0, iva: 19,
    keywords: ['celular', 'telefono', 'smartphone', 'movil', 'iphone', 'samsung'],
    vistoBueno: ['MinTIC — Homologación de equipos', 'SIC — Reglamento técnico'],
    documentos: ['Homologación MinTIC', 'Factura comercial', 'Certificado de conformidad'],
    notas: 'Requiere homologación ante MinTIC antes de importar. Arancel 0% por CAN.'
  },
  {
    codigo: '3004.90.99.00', titulo: 'Medicamentos para uso humano (otros)',
    desc: 'Medicamentos preparados para uso terapéutico o profiláctico, no clasificados en otra partida.',
    seccion: 'Farmacéutica', arancel: 0, iva: 0,
    keywords: ['medicamentos', 'farmacia', 'drogas', 'pastillas', 'capsulas'],
    vistoBueno: ['INVIMA — Registro sanitario obligatorio'],
    documentos: ['Registro sanitario INVIMA', 'Certificado BPM', 'Certificado de análisis', 'Concepto previo INVIMA'],
    notas: 'IVA 0% para medicamentos. Registro INVIMA obligatorio antes de importar.'
  },
  {
    codigo: '2709.00.00.00', titulo: 'Aceites crudos de petróleo',
    desc: 'Aceites crudos de petróleo o de mineral bituminoso.',
    seccion: 'Energía y minería', arancel: 0, iva: 0,
    keywords: ['petroleo', 'crudo', 'oil', 'combustible', 'hidrocarburo'],
    vistoBueno: ['MinMinas — Autorización importación/exportación', 'ANLA — Licencia ambiental'],
    documentos: ['Autorización MinMinas', 'Licencia ambiental ANLA', 'Certificado de calidad'],
    notas: 'Producto estratégico. Requiere autorización MinMinas. IVA excluido.'
  },
  {
    codigo: '8708.99.90.00', titulo: 'Partes y accesorios para vehículos automotores',
    desc: 'Piezas, partes y accesorios para automóviles, camiones y vehículos de motor.',
    seccion: 'Automotriz', arancel: 15, iva: 19,
    keywords: ['repuestos', 'autopartes', 'vehiculos', 'carros', 'camiones'],
    vistoBueno: ['SIC — Reglamento técnico RETIE si aplica'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Certificado de origen'],
    notas: 'Arancel variable según origen. Con TLC USA: 0%. Sin TLC: 15%.'
  },
  {
    codigo: '1001.19.00.00', titulo: 'Trigo (excepto para siembra)',
    desc: 'Trigo común y escanda para usos distintos a la siembra.',
    seccion: 'Alimentaria', arancel: 20, iva: 0,
    keywords: ['trigo', 'wheat', 'cereal', 'harina', 'grano'],
    vistoBueno: ['ICA — Permiso fitosanitario'],
    documentos: ['Permiso fitosanitario ICA', 'Certificado fitosanitario origen', 'Factura comercial'],
    notas: 'IVA 0% como alimento básico. Sujeto a franja de precios andina.'
  },
  {
    codigo: '2204.21.00.00', titulo: 'Vinos de uva frescos (en recipientes ≤ 2L)',
    desc: 'Vinos de uva, incluso encabezados, en recipientes con capacidad inferior o igual a 2 litros.',
    seccion: 'Alimentaria', arancel: 20, iva: 19,
    keywords: ['vino', 'wine', 'uva', 'bebida alcoholica', 'licor'],
    vistoBueno: ['INVIMA — Registro sanitario bebidas alcohólicas'],
    documentos: ['Registro sanitario INVIMA', 'Certificado de análisis', 'Etiqueta aprobada INVIMA'],
    notas: 'Adicionalmente aplica impuesto al consumo de licores según departamento.'
  },
  {
    codigo: '6104.43.00.00', titulo: 'Vestidos de mujer de fibras sintéticas',
    desc: 'Vestidos para mujeres o niñas, de fibras sintéticas o artificiales, de tejido de punto.',
    seccion: 'Textil y confección', arancel: 40, iva: 19,
    keywords: ['ropa', 'vestidos', 'textil', 'confeccion', 'moda', 'prendas'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Lista de empaque', 'Etiqueta en español'],
    notas: 'Arancel del 40% para proteger la industria textil colombiana. Etiquetado obligatorio en español.'
  },
  {
    codigo: '8703.23.00.90', titulo: 'Vehículos automóviles (motor 1500–3000cc)',
    desc: 'Automóviles de turismo con motor de émbolo alternativo de encendido por chispa, cilindrada entre 1500 y 3000 cc.',
    seccion: 'Automotriz', arancel: 35, iva: 19,
    keywords: ['carro', 'automovil', 'vehiculo', 'sedan', 'suv'],
    vistoBueno: ['RUNT — Registro vehículo', 'MinTransporte — Homologación'],
    documentos: ['Homologación MinTransporte', 'Registro RUNT', 'Factura comercial', 'BL o AWB'],
    notas: 'Además del arancel e IVA, aplica impuesto de vehículos según cilindraje y valor.'
  },
  {
    codigo: '9403.60.00.00', titulo: 'Muebles de madera (otros)',
    desc: 'Muebles de madera distintos a los de dormitorio, cocina u oficina.',
    seccion: 'Madera y muebles', arancel: 15, iva: 19,
    keywords: ['muebles', 'madera', 'furniture', 'sillas', 'mesa', 'sofa'],
    vistoBueno: ['ICA — Certificado fitosanitario para madera'],
    documentos: ['Certificado fitosanitario ICA', 'Certificado CITES si aplica', 'Factura comercial'],
    notas: 'La madera requiere certificado fitosanitario ICA. Especies protegidas requieren CITES.'
  },
  {
    codigo: '3921.19.00.00', titulo: 'Placas y láminas de plástico (otras)',
    desc: 'Placas, hojas, películas y tiras de polímeros distintos al polietileno y poliestireno.',
    seccion: 'Químicos y plásticos', arancel: 10, iva: 19,
    keywords: ['plastico', 'laminas', 'placas', 'polimero', 'pvc'],
    vistoBueno: ['ANLA — Si es sustancia peligrosa'],
    documentos: ['Factura comercial', 'Ficha técnica', 'MSDS si es peligroso'],
    notas: 'Arancel del 10%. Si el material es peligroso o contiene sustancias controladas requiere ANLA.'
  },
  {
    codigo: '0302.11.00.00', titulo: 'Truchas frescas o refrigeradas',
    desc: 'Truchas de las especies Salmo trutta, Oncorhynchus, frescas o refrigeradas.',
    seccion: 'Alimentaria', arancel: 20, iva: 0,
    keywords: ['trucha', 'pescado', 'salmon', 'pez', 'acuicultura'],
    vistoBueno: ['ICA — Permiso sanitario productos acuícolas', 'INVIMA — Registro sanitario'],
    documentos: ['Permiso ICA', 'Registro INVIMA', 'Certificado sanitario origen', 'Cadena de frío'],
    notas: 'IVA 0% como alimento. Requiere cadena de frío certificada y permiso ICA.'
  },
  {
    codigo: '7208.51.00.00', titulo: 'Productos laminados planos de hierro o acero',
    desc: 'Productos laminados planos de hierro o acero sin alear, de anchura superior a 600mm.',
    seccion: 'Metales', arancel: 10, iva: 19,
    keywords: ['acero', 'hierro', 'laminas', 'steel', 'metal', 'estructural'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Certificado de calidad del acero', 'Lista de empaque'],
    notas: 'Puede estar sujeto a medidas antidumping según país de origen.'
  },
  {
    codigo: '8802.40.00.00', titulo: 'Aeronaves de peso superior a 15.000 kg',
    desc: 'Aviones y demás aeronaves de peso en vacío superior a 15.000 kg.',
    seccion: 'Aeronáutica', arancel: 0, iva: 0,
    keywords: ['avion', 'aeronave', 'aircraft', 'aerolinea', 'boeing', 'airbus'],
    vistoBueno: ['Aerocivil — Permiso importación aeronaves', 'Matrícula aeronáutica'],
    documentos: ['Permiso Aerocivil', 'Certificado de aeronavegabilidad', 'Matrícula', 'Manual de mantenimiento'],
    notas: 'IVA excluido y arancel 0%. Requiere proceso especial ante Aerocivil.'
  }
];

const secciones = [...new Set(subpartidas.map(s => s.seccion))];

let filtroSeccion = 'todas';
let busqueda = '';

function renderFiltros() {
  const wrap = document.getElementById('filtros-secciones');
  wrap.innerHTML = `<button class="filtro-btn active" data-sec="todas">Todas</button>`;
  secciones.forEach(sec => {
    wrap.innerHTML += `<button class="filtro-btn" data-sec="${sec}">${sec}</button>`;
  });
  wrap.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtroSeccion = btn.dataset.sec;
      renderGrid();
    });
  });
}

function renderGrid() {
  const grid = document.getElementById('sp-grid');
  const sinRes = document.getElementById('sin-resultados');
  const stats = document.getElementById('total-resultados');
  grid.innerHTML = '';

  const q = busqueda.toLowerCase();
  const resultado = subpartidas.filter(sp => {
    const matchSec = filtroSeccion === 'todas' || sp.seccion === filtroSeccion;
    const matchBusqueda = q === '' ||
      sp.titulo.toLowerCase().includes(q) ||
      sp.codigo.includes(q) ||
      sp.desc.toLowerCase().includes(q) ||
      sp.keywords.some(k => k.includes(q));
    return matchSec && matchBusqueda;
  });

  stats.textContent = `Mostrando ${resultado.length} producto${resultado.length !== 1 ? 's' : ''}`;

  if (resultado.length === 0) {
    sinRes.style.display = 'block';
    return;
  }
  sinRes.style.display = 'none';

  resultado.forEach(sp => {
    grid.innerHTML += `
      <div class="sp-card" data-codigo="${sp.codigo}">
        <div class="sp-card-code">${sp.codigo}</div>
        <div class="sp-card-title">${sp.titulo}</div>
        <div class="sp-card-desc">${sp.desc}</div>
        <div class="sp-card-footer">
          <span class="sp-arancel">Arancel: ${sp.arancel}%</span>
          <span class="sp-seccion">${sp.seccion}</span>
        </div>
      </div>`;
  });

  grid.querySelectorAll('.sp-card').forEach(card => {
    card.addEventListener('click', () => {
      const sp = subpartidas.find(s => s.codigo === card.dataset.codigo);
      if (sp) abrirModal(sp);
    });
  });
}

function abrirModal(sp) {
  const vb = sp.vistoBueno.length > 0
    ? sp.vistoBueno.map(v => `<span class="modal-tag">⚠️ ${v}</span>`).join('')
    : '<span class="modal-tag">✅ Sin vistos buenos especiales</span>';

  const docs = sp.documentos.map(d => `<div class="modal-req">${d}</div>`).join('');

  document.getElementById('sp-modal-contenido').innerHTML = `
    <div class="modal-code">${sp.codigo}</div>
    <div class="modal-title">${sp.titulo}</div>
    <div class="modal-desc">${sp.desc}</div>

    <div class="modal-grid">
      <div class="modal-stat">
        <div class="modal-stat-label">Arancel</div>
        <div class="modal-stat-value">${sp.arancel}%</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">IVA</div>
        <div class="modal-stat-value azul">${sp.iva}%</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">Sección SA</div>
        <div class="modal-stat-value amarillo" style="font-size:14px">${sp.seccion}</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">Tributo total est.</div>
        <div class="modal-stat-value">${sp.arancel + sp.iva}%</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Vistos buenos requeridos</div>
      ${vb}
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Documentos requeridos</div>
      ${docs}
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Notas importantes</div>
      <p style="font-size:13px;color:#9ca3af;line-height:1.7">${sp.notas}</p>
    </div>
  `;

  document.getElementById('sp-modal-overlay').style.display = 'flex';
}

document.getElementById('buscador').addEventListener('input', e => {
  busqueda = e.target.value;
  renderGrid();
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  document.getElementById('buscador').value = '';
  busqueda = '';
  renderGrid();
});

document.getElementById('sp-modal-close').addEventListener('click', () => {
  document.getElementById('sp-modal-overlay').style.display = 'none';
});

document.getElementById('sp-modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('sp-modal-overlay')) {
    document.getElementById('sp-modal-overlay').style.display = 'none';
  }
});

renderFiltros();
renderGrid();