const vistosBuenos = [
  {
    entidad: 'INVIMA',
    titulo: 'Alimentos y bebidas procesadas',
    desc: 'Todo alimento procesado, bebida, suplemento alimenticio o ingrediente que se importe o exporte requiere registro o notificación sanitaria del INVIMA.',
    subpartidas: ['21.01', '21.02', '21.03', '21.04', '21.05', '21.06', '22.01', '22.02', '22.03', '22.04'],
    keywords: ['alimentos', 'bebidas', 'comida', 'procesado', 'suplemento'],
    requisitos: [
      'Registro sanitario INVIMA vigente',
      'Notificación sanitaria obligatoria (NSO) para alimentos de menor riesgo',
      'Etiquetado conforme a resolución 5109 de 2005',
      'Concepto de importación INVIMA previo al embarque'
    ]
  },
  {
    entidad: 'INVIMA',
    titulo: 'Medicamentos y productos farmacéuticos',
    desc: 'Medicamentos de uso humano, veterinario, dispositivos médicos y reactivos de diagnóstico requieren registro INVIMA obligatorio.',
    subpartidas: ['30.01', '30.02', '30.03', '30.04', '30.05', '30.06'],
    keywords: ['medicamentos', 'farmaceutico', 'drogas', 'pastillas', 'vacunas', 'dispositivos medicos'],
    requisitos: [
      'Registro sanitario INVIMA para medicamentos',
      'Certificado de Buenas Prácticas de Manufactura (BPM)',
      'Certificado de análisis del lote',
      'Poder notariado del representante legal',
      'Concepto previo de importación'
    ]
  },
  {
    entidad: 'INVIMA',
    titulo: 'Cosméticos y productos de aseo',
    desc: 'Cosméticos, perfumes, productos de higiene personal y aseo del hogar requieren notificación sanitaria ante el INVIMA.',
    subpartidas: ['33.01', '33.02', '33.03', '33.04', '33.05', '33.06', '33.07'],
    keywords: ['cosmeticos', 'perfume', 'shampoo', 'crema', 'maquillaje', 'aseo', 'higiene'],
    requisitos: [
      'Notificación sanitaria obligatoria (NSO)',
      'Certificado de libre venta del país de origen',
      'Fórmula cualitativa y cuantitativa',
      'Ficha técnica del producto',
      'Etiqueta con requisitos INVIMA'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Animales vivos y productos de origen animal',
    desc: 'La importación o exportación de animales vivos, carnes, lácteos, huevos y subproductos de origen animal requiere permiso sanitario del ICA.',
    subpartidas: ['01.01', '01.02', '01.03', '01.04', '01.05', '02.01', '02.02', '02.03', '04.01', '04.02'],
    keywords: ['animales', 'ganado', 'carne', 'lacteos', 'leche', 'huevos', 'aves', 'porcinos'],
    requisitos: [
      'Permiso sanitario de importación ICA',
      'Certificado zoosanitario del país de origen',
      'Certificado de vacunación vigente',
      'Inspección en puerto de entrada por ICA',
      'Cuarentena si aplica según especie y origen'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Vegetales, semillas y material vegetal',
    desc: 'Plantas, flores, frutas, verduras, semillas y material de propagación requieren certificado fitosanitario del ICA.',
    subpartidas: ['06.01', '06.02', '07.01', '07.02', '08.01', '08.02', '10.01', '10.02', '12.01'],
    keywords: ['plantas', 'flores', 'frutas', 'verduras', 'semillas', 'cafe', 'banano', 'arroz', 'maiz'],
    requisitos: [
      'Permiso fitosanitario de importación ICA',
      'Certificado fitosanitario del país de origen',
      'Inspección fitosanitaria en punto de ingreso',
      'Tratamiento cuarentenario si se detectan plagas',
      'Registro ICA para importadores de material vegetal'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Insumos agropecuarios y fertilizantes',
    desc: 'Plaguicidas, fertilizantes, medicamentos veterinarios y bioinsumos requieren registro ICA previo a su importación.',
    subpartidas: ['31.01', '31.02', '31.03', '31.04', '31.05', '38.08'],
    keywords: ['fertilizantes', 'plaguicidas', 'pesticidas', 'abono', 'insecticida', 'veterinario'],
    requisitos: [
      'Registro ICA del producto',
      'Concepto técnico de importación ICA',
      'Certificado de composición química',
      'Ficha de seguridad (MSDS)',
      'Etiqueta aprobada por ICA'
    ]
  },
  {
    entidad: 'MinDefensa',
    titulo: 'Armas, municiones y explosivos',
    desc: 'La importación y exportación de armas de fuego, municiones, explosivos y accesorios está controlada por el Ministerio de Defensa — INDUMIL.',
    subpartidas: ['36.01', '36.02', '36.03', '36.04', '93.01', '93.02', '93.03', '93.04'],
    keywords: ['armas', 'municiones', 'explosivos', 'pistolas', 'rifles', 'dinamita', 'policia', 'militar'],
    requisitos: [
      'Permiso de importación Ministerio de Defensa',
      'Autorización INDUMIL',
      'Certificado de usuario final',
      'Licencia de porte o tenencia vigente',
      'Registro ante la autoridad competente'
    ]
  },
  {
    entidad: 'ANLA',
    titulo: 'Sustancias químicas y productos peligrosos',
    desc: 'Sustancias químicas controladas, residuos peligrosos y productos con impacto ambiental requieren autorización de la ANLA.',
    subpartidas: ['28.01', '28.02', '28.03', '28.04', '28.05', '38.01', '38.02', '38.03'],
    keywords: ['quimicos', 'sustancias', 'acidos', 'solventes', 'peligroso', 'toxico', 'residuos'],
    requisitos: [
      'Licencia ambiental ANLA si aplica',
      'Registro de generadores de residuos peligrosos',
      'Plan de gestión de devolución de productos',
      'Ficha de seguridad (MSDS) en español',
      'Etiquetado según normas GHS/SGA'
    ]
  },
  {
    entidad: 'SIC',
    titulo: 'Equipos eléctricos y electrónicos',
    desc: 'Productos eléctricos, electrónicos, juguetes y elementos de uso doméstico deben cumplir reglamentos técnicos de la SIC.',
    subpartidas: ['84.71', '84.73', '85.01', '85.02', '85.03', '85.17', '85.25', '85.28'],
    keywords: ['electronicos', 'computadores', 'telefonos', 'electrodomesticos', 'cables', 'television', 'celular'],
    requisitos: [
      'Certificado de conformidad con reglamento técnico',
      'Pruebas de laboratorio acreditado',
      'Declaración de conformidad del fabricante',
      'Registro del producto ante la SIC',
      'Etiqueta energética si aplica'
    ]
  },
  {
    entidad: 'SIC',
    titulo: 'Juguetes y artículos para niños',
    desc: 'Los juguetes y artículos de uso infantil deben cumplir el reglamento técnico NTC 4894 y obtener certificado de conformidad.',
    subpartidas: ['95.01', '95.02', '95.03', '95.04', '95.05'],
    keywords: ['juguetes', 'ninos', 'infantil', 'muñecas', 'legos', 'peluches'],
    requisitos: [
      'Certificado de conformidad NTC 4894',
      'Pruebas en laboratorio acreditado por ONAC',
      'Advertencias de seguridad en español',
      'Edad mínima recomendada en etiqueta',
      'Información del importador en el empaque'
    ]
  },
  {
    entidad: 'MinMinas',
    titulo: 'Combustibles y productos minero-energéticos',
    desc: 'La importación de combustibles, gas, carbón y productos derivados del petróleo requiere autorización del Ministerio de Minas y Energía.',
    subpartidas: ['27.01', '27.02', '27.03', '27.04', '27.09', '27.10', '27.11'],
    keywords: ['combustible', 'gasolina', 'petroleo', 'gas', 'carbon', 'diesel', 'aceite mineral'],
    requisitos: [
      'Registro como importador de combustibles ante MinMinas',
      'Autorización de importación MinMinas',
      'Certificado de calidad del producto',
      'Póliza de cumplimiento',
      'Informe de importación mensual'
    ]
  },
  {
    entidad: 'Aerocivil',
    titulo: 'Aeronaves y partes aeronáuticas',
    desc: 'La importación de aeronaves, helicópteros, drones y sus componentes requiere autorización de la Aeronáutica Civil de Colombia.',
    subpartidas: ['88.01', '88.02', '88.03', '88.04', '88.05'],
    keywords: ['aviones', 'helicopteros', 'drones', 'aeronaves', 'aeropartes', 'aeronautica'],
    requisitos: [
      'Permiso de importación Aerocivil',
      'Certificado de aeronavegabilidad',
      'Matrícula de la aeronave',
      'Manual de mantenimiento aprobado',
      'Registro de operador para drones comerciales'
    ]
  }
];

let filtroActual = 'todos';
let busquedaActual = '';

function renderCards() {
  const grid = document.getElementById('vb-grid');
  const sinResultados = document.getElementById('sin-resultados');
  grid.innerHTML = '';

  const resultado = vistosBuenos.filter(vb => {
    const matchEntidad = filtroActual === 'todos' || vb.entidad === filtroActual;
    const q = busquedaActual.toLowerCase();
    const matchBusqueda = q === '' ||
      vb.titulo.toLowerCase().includes(q) ||
      vb.desc.toLowerCase().includes(q) ||
      vb.entidad.toLowerCase().includes(q) ||
      vb.keywords.some(k => k.includes(q)) ||
      vb.subpartidas.some(s => s.includes(q));
    return matchEntidad && matchBusqueda;
  });

  if (resultado.length === 0) {
    sinResultados.style.display = 'block';
    return;
  }

  sinResultados.style.display = 'none';

  resultado.forEach(vb => {
    const chips = vb.subpartidas.map(s => `<span class="vb-chip">${s}</span>`).join('');
    const reqs = vb.requisitos.map(r => `<div class="vb-req-item">${r}</div>`).join('');

    grid.innerHTML += `
      <div class="vb-card">
        <div class="vb-card-header">
          <span class="vb-entidad-badge badge-${vb.entidad}">${vb.entidad}</span>
          <span class="vb-card-title">${vb.titulo}</span>
        </div>
        <p class="vb-card-desc">${vb.desc}</p>
        <div class="vb-subpartidas">
          <div class="vb-subpartidas-title">Subpartidas relacionadas</div>
          <div class="vb-chips">${chips}</div>
        </div>
        <div class="vb-requisitos">
          <div class="vb-requisitos-title">Requisitos</div>
          ${reqs}
        </div>
      </div>`;
  });
}

// Buscador
document.getElementById('buscador').addEventListener('input', e => {
  busquedaActual = e.target.value;
  renderCards();
});

// Limpiar
document.getElementById('btnLimpiar').addEventListener('click', () => {
  document.getElementById('buscador').value = '';
  busquedaActual = '';
  renderCards();
});

// Filtros por entidad
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroActual = btn.dataset.entidad;
    renderCards();
  });
});

renderCards();  