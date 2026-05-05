const modalidades = {
  definitiva: {
    titulo: 'Exportación Definitiva',
    badge: 'DEF',
    subtitulo: 'Salida definitiva de mercancías nacionales o nacionalizadas',
    info: `<strong>¿Cuándo se usa?</strong> Es la modalidad estándar de venta internacional. La mercancía sale de Colombia para uso o consumo definitivo en otro país.<ul><li>Decreto 1165 de 2019 — Art. 230</li><li>Requiere Declaración de Exportación (DEX)</li><li>Solicitud de Autorización de Embarque (SAE) previa</li><li>El exportador debe estar inscrito en el RUT como exportador</li></ul>`,
    campos: ['exw', 'transporte', 'agencia', 'certOrigen', 'flete', 'seguro', 'trm', 'incoterm', 'pais'],
    documentos: [
      'Factura comercial (Commercial Invoice)',
      'Lista de empaque (Packing List)',
      'Declaración de Exportación (DEX)',
      'Solicitud de Autorización de Embarque (SAE)',
      'Conocimiento de embarque (B/L) o Guía aérea (AWB)',
      'Certificado de origen (si aplica TLC)'
    ],
    restricciones: null,
    calcular: (v) => {
      const fob = v.exw + v.transporte + v.agencia + v.certOrigen;
      const fleteCOP = v.flete * v.trm;
      const seguroCOP = v.seguro * v.trm;
      const cif = fob + fleteCOP + seguroCOP;
      const precios = { EXW: v.exw, FOB: fob, CFR: fob + fleteCOP, CIF: cif, DAP: cif, DDP: cif };
      const total = precios[v.incoterm] || fob;
      return [
        { label: 'Precio en planta (EXW)', valor: cop(v.exw) },
        { label: '+ Transporte interno', valor: cop(v.transporte) },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: '+ Certificado de origen', valor: cop(v.certOrigen) },
        { label: '= Valor FOB', valor: cop(fob), clase: 'destacado' },
        { label: '+ Flete internacional', valor: cop(fleteCOP) },
        { label: '+ Seguro', valor: cop(seguroCOP) },
        { label: '= Valor CIF', valor: cop(cif), clase: 'destacado' },
        { label: `Precio según ${v.incoterm}`, valor: cop(total), clase: 'total' },
        { label: 'Equivalente USD', valor: usd(total / v.trm) }
      ];
    }
  },

  menaje: {
    titulo: 'Exportación de Menaje',
    badge: 'MEN',
    subtitulo: 'Bienes personales de residentes que salen del país definitivamente',
    info: `<strong>¿Cuándo se usa?</strong> Para colombianos o residentes que salen del país para fijar residencia en el exterior y desean llevar sus bienes personales.<ul><li>Decreto 1165 de 2019 — Art. 243</li><li>Plazo: 30 días antes o 120 días después de la salida</li><li>Incluye: muebles, electrodomésticos, accesorios de vivienda y mascotas</li><li>Exento de tributos de exportación</li></ul>`,
    campos: ['valorMenaje', 'trm', 'transporte', 'agencia'],
    documentos: [
      'Declaración de Exportación (DEX) — menaje',
      'Pasaporte o documento de identidad',
      'Visa o permiso de residencia en país destino',
      'Inventario detallado de bienes',
      'Conocimiento de embarque (B/L)'
    ],
    restricciones: null,
    calcular: (v) => {
      const totalCOP = v.valorMenaje + v.transporte + v.agencia;
      const totalUSD = totalCOP / v.trm;
      return [
        { label: 'Valor estimado del menaje', valor: cop(v.valorMenaje) },
        { label: '+ Transporte al puerto', valor: cop(v.transporte) },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: 'COSTO TOTAL OPERACIÓN', valor: cop(totalCOP), clase: 'total' },
        { label: 'Equivalente USD', valor: usd(totalUSD) }
      ];
    }
  },

  postal: {
    titulo: 'Tráfico Postal y Envíos Urgentes',
    badge: 'POST',
    subtitulo: 'Salida de paquetes por correo o courier internacional',
    info: `<strong>¿Cuándo se usa?</strong> Para envíos pequeños por correo oficial o empresas courier (DHL, FedEx, UPS). Requiere cumplimiento de vistos buenos si la mercancía lo exige.<ul><li>Decreto 1165 de 2019 — Art. 247</li><li>Peso máximo por envío: 30 kg</li><li>Valor máximo: USD 2.000 por envío</li><li>No requiere DEX si el valor es menor a USD 2.000</li></ul>`,
    campos: ['fob', 'trm', 'agencia'],
    documentos: [
      'Guía de courier (DHL, FedEx, UPS, etc.)',
      'Factura comercial o declaración de contenido',
      'Lista de empaque',
      'Vistos buenos si aplica (INVIMA, ICA, etc.)'
    ],
    restricciones: '⚠️ No se pueden enviar por esta modalidad: armas, explosivos, sustancias peligrosas, billetes, divisas, metales preciosos ni mercancías prohibidas.',
    calcular: (v) => {
      const requiereDEX = v.fob > 2000;
      const totalCOP = (v.fob * v.trm) + v.agencia;
      return [
        { label: 'Valor del envío (FOB)', valor: usd(v.fob) },
        { label: 'Equivalente en COP', valor: cop(v.fob * v.trm) },
        { label: '+ Agencia / courier', valor: cop(v.agencia) },
        { label: 'Requiere DEX', valor: requiereDEX ? '✅ Sí (valor > USD 2.000)' : '❌ No (valor ≤ USD 2.000)', clase: requiereDEX ? 'destacado' : 'exento' },
        { label: 'COSTO TOTAL OPERACIÓN', valor: cop(totalCOP), clase: 'total' }
      ];
    }
  },

  muestras: {
    titulo: 'Muestras sin Valor Comercial',
    badge: 'MVS',
    subtitulo: 'Envíos promocionales o de estudio sin fines de venta',
    info: `<strong>¿Cuándo se usa?</strong> Para enviar muestras de productos con fines promocionales o de negociación.<ul><li>Decreto 1165 de 2019 — Art. 248</li><li>Límite anual: USD 10.000 FOB total</li><li>No requiere reintegro de divisas</li><li>Exenta de tributos de exportación</li></ul>`,
    campos: ['fob', 'trm', 'agencia'],
    documentos: [
      'Declaración de Exportación (DEX) — muestras',
      'Factura pro forma o declaración de muestras',
      'Lista de empaque con descripción detallada',
      'Vistos buenos si aplica'
    ],
    restricciones: '🚫 No se pueden exportar como muestras: café (salvo autorización FNC), esmeraldas, metales preciosos, órganos humanos, estupefacientes ni bienes del patrimonio histórico o artístico.',
    calcular: (v) => {
      const excedeLimite = v.fob > 10000;
      const totalCOP = (v.fob * v.trm) + v.agencia;
      return [
        { label: 'Valor FOB muestras', valor: usd(v.fob) },
        { label: 'Límite anual permitido', valor: 'USD 10.000', clase: 'exento' },
        { label: excedeLimite ? '⚠️ EXCEDE el límite anual' : '✅ Dentro del límite', valor: '', clase: excedeLimite ? 'suspendido' : 'exento' },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: 'COSTO TOTAL OPERACIÓN', valor: cop(totalCOP), clase: 'total' }
      ];
    }
  },

  reembarque: {
    titulo: 'Reembarque',
    badge: 'REM',
    subtitulo: 'Salida de mercancías extranjeras sin haber sido importadas',
    info: `<strong>¿Cuándo se usa?</strong> Para mercancías que llegaron al país desde el exterior pero no fueron sometidas a ninguna modalidad de importación y se devuelven al exterior.<ul><li>Decreto 1165 de 2019 — Art. 249</li><li>Debe realizarse dentro de la vigencia de la SAE</li><li>No aplica para sustancias químicas controladas</li><li>No aplica para mercancías en abandono legal</li></ul>`,
    campos: ['fob', 'trm', 'agencia'],
    documentos: [
      'Solicitud de Autorización de Embarque (SAE)',
      'Declaración de importación original',
      'Conocimiento de embarque (B/L) original',
      'Factura comercial del proveedor'
    ],
    restricciones: '⚠️ No aplica para: sustancias químicas controladas, mercancías prohibidas ni mercancías en estado de abandono legal.',
    calcular: (v) => {
      const totalCOP = (v.fob * v.trm) + v.agencia;
      return [
        { label: 'Valor FOB mercancía', valor: usd(v.fob) },
        { label: 'Equivalente en COP', valor: cop(v.fob * v.trm) },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: 'COSTO TOTAL OPERACIÓN', valor: cop(totalCOP), clase: 'total' }
      ];
    }
  },

  'temporal-mismo': {
    titulo: 'Exportación Temporal — Mismo Estado',
    badge: 'TMP',
    subtitulo: 'Salida temporal para feria, exposición o uso específico',
    info: `<strong>¿Cuándo se usa?</strong> Para mercancías que salen temporalmente (ferias, exposiciones, reparaciones) y regresarán a Colombia en el mismo estado.<ul><li>Decreto 1165 de 2019 — Art. 244</li><li>El bien no puede sufrir modificaciones salvo deterioro normal</li><li>Si se decide vender en el exterior, debe cambiarse a Exportación Definitiva</li><li>Plazo: el autorizado por la DIAN según el caso</li></ul>`,
    campos: ['fob', 'trm', 'agencia', 'meses'],
    documentos: [
      'Declaración de Exportación Temporal (DEX temporal)',
      'Solicitud de Autorización de Embarque (SAE)',
      'Inventario detallado de los bienes',
      'Documento que acredita el motivo (invitación a feria, contrato, etc.)'
    ],
    restricciones: null,
    calcular: (v) => {
      const totalCOP = (v.fob * v.trm) + v.agencia;
      return [
        { label: 'Valor FOB mercancía', valor: usd(v.fob) },
        { label: 'Equivalente en COP', valor: cop(v.fob * v.trm) },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: 'Plazo autorizado', valor: `${v.meses} meses` },
        { label: 'COSTO TOTAL OPERACIÓN', valor: cop(totalCOP), clase: 'total' },
        { label: '⚠️ Al regresar: Reimportación en mismo estado (C160)', valor: '', clase: 'exento' }
      ];
    }
  },

  perfeccionamiento: {
    titulo: 'Exportación Temporal — Perfeccionamiento Pasivo',
    badge: 'PPV',
    subtitulo: 'Salida para transformación, reparación o elaboración en el exterior',
    info: `<strong>¿Cuándo se usa?</strong> Cuando una mercancía nacional o nacionalizada sale al exterior para ser transformada, reparada o elaborada, y luego reimportada.<ul><li>Decreto 1165 de 2019 — Art. 245</li><li>Debe reimportarse dentro del plazo autorizado por la DIAN</li><li>Al reimportar: solo paga tributos sobre el valor agregado en el exterior</li><li>Requiere programa aprobado por la DIAN</li></ul>`,
    campos: ['fob', 'trm', 'agencia', 'meses', 'valorAgregado'],
    documentos: [
      'Declaración de Exportación Temporal (DEX temporal)',
      'Contrato de transformación o reparación',
      'Solicitud de Autorización de Embarque (SAE)',
      'Descripción técnica del proceso a realizar'
    ],
    restricciones: null,
    calcular: (v) => {
      const totalCOP = (v.fob * v.trm) + v.agencia;
      const arancelReimp = v.valorAgregado * v.trm * 0.15;
      const ivaReimp = (v.valorAgregado * v.trm + arancelReimp) * 0.19;
      const tributosReimp = arancelReimp + ivaReimp;
      return [
        { label: 'Valor FOB mercancía', valor: usd(v.fob) },
        { label: '+ Agencia de aduanas', valor: cop(v.agencia) },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: 'COSTO EXPORTACIÓN', valor: cop(totalCOP), clase: 'destacado' },
        { label: 'Plazo autorizado', valor: `${v.meses} meses` },
        { label: '— AL REIMPORTAR —', valor: '', clase: 'destacado' },
        { label: 'Valor agregado en exterior', valor: usd(v.valorAgregado) },
        { label: 'Arancel sobre valor agregado (15%)', valor: cop(arancelReimp) },
        { label: 'IVA sobre valor agregado (19%)', valor: cop(ivaReimp) },
        { label: 'TRIBUTOS AL REIMPORTAR', valor: cop(tributosReimp), clase: 'total' }
      ];
    }
  },

  viajeros: {
    titulo: 'Exportación Temporal por Viajeros',
    badge: 'VJR',
    subtitulo: 'Bienes que el viajero lleva y planea reimportar al regresar',
    info: `<strong>¿Cuándo se usa?</strong> Para bienes personales que un viajero lleva al salir de Colombia y que planea traer de regreso sin pagar tributos.<ul><li>Decreto 1165 de 2019 — Art. 246</li><li>Requiere diligenciar el Formulario 530 ante la aduana al salir</li><li>Al regresar: se presenta el F530 para acreditar que los bienes salieron de Colombia</li><li>Sin el F530, al regresar podrían cobrar tributos de importación</li></ul>`,
    campos: ['fob', 'trm'],
    documentos: [
      'Formulario 530 — Declaración de Equipaje, Dinero y Títulos',
      'Factura o documento que acredite propiedad del bien',
      'Pasaporte o documento de viaje'
    ],
    restricciones: '⚠️ Sin el Formulario 530 al salir, al regresar con los mismos bienes podrían ser tratados como importación y generar tributos.',
    calcular: (v) => {
      return [
        { label: 'Valor estimado bienes', valor: usd(v.fob) },
        { label: 'Equivalente COP', valor: cop(v.fob * v.trm) },
        { label: 'Tributos de exportación', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: 'Formulario 530', valor: '⚠️ OBLIGATORIO al salir', clase: 'suspendido' },
        { label: 'Al reimportar', valor: '✅ Sin tributos con F530', clase: 'exento' }
      ];
    }
  }
};

const camposHTML = {
  exw: `<div class="input-group"><label>Precio en planta / EXW (COP)</label><input type="number" id="exw" placeholder="Ej: 5000000" min="0"></div>`,
  fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" id="fob" placeholder="Ej: 10000" min="0"></div>`,
  transporte: `<div class="input-group"><label>Transporte interno — planta a puerto (COP)</label><input type="number" id="transporte" placeholder="Ej: 300000" min="0"></div>`,
  agencia: `<div class="input-group"><label>Agencia de aduanas (COP)</label><input type="number" id="agencia" placeholder="Ej: 400000" min="0"></div>`,
  certOrigen: `<div class="input-group"><label>Certificado de origen (COP)</label><input type="number" id="certOrigen" placeholder="Ej: 50000" min="0"></div>`,
  flete: `<div class="input-group"><label>Flete internacional (USD)</label><input type="number" id="flete" placeholder="Ej: 500" min="0"></div>`,
  seguro: `<div class="input-group"><label>Seguro internacional (USD)</label><input type="number" id="seguro" placeholder="Ej: 100" min="0"></div>`,
  trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" id="trm" placeholder="Cargando..."><span class="trm-status" id="trm-status"></span></div>`,
  meses: `<div class="input-group"><label>Plazo autorizado (meses)</label><input type="number" id="meses" placeholder="Ej: 6" min="1" max="60"></div>`,
  valorMenaje: `<div class="input-group"><label>Valor estimado del menaje (COP)</label><input type="number" id="valorMenaje" placeholder="Ej: 20000000" min="0"></div>`,
  valorAgregado: `<div class="input-group"><label>Valor agregado en el exterior (USD)</label><input type="number" id="valorAgregado" placeholder="Ej: 2000" min="0"></div>`,
  incoterm: `<div class="input-group"><label>Incoterm de venta</label><select id="incoterm"><option value="EXW">EXW</option><option value="FOB" selected>FOB</option><option value="CFR">CFR</option><option value="CIF">CIF</option><option value="DAP">DAP</option><option value="DDP">DDP</option></select></div>`,
  pais: `<div class="input-group"><label>País de destino</label><select id="pais"><option value="">Selecciona</option><option value="USA">Estados Unidos</option><option value="CHN">China</option><option value="ECU">Ecuador</option><option value="PER">Perú</option><option value="MEX">México</option><option value="DEU">Alemania</option><option value="ESP">España</option><option value="PAN">Panamá</option><option value="BRA">Brasil</option></select></div>`
};

const usd = v => `USD ${(+v).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const cop = v => `COP ${(+v).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

async function cargarTRM() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
    const data = await res.json();
    const el = document.getElementById('trm');
    if (el) {
      el.value = Math.round(data.rates.COP);
      const st = document.getElementById('trm-status');
      if (st) st.textContent = `✅ TRM cargada — ${new Date().toLocaleDateString('es-CO')}`;
    }
  } catch { }
}

function renderModal(key) {
  const m = modalidades[key];
  if (!m) return;

  document.getElementById('modal-titulo').textContent = m.titulo;
  document.getElementById('modal-subtitulo').textContent = m.subtitulo;
  document.getElementById('modal-badge').textContent = m.badge;

  const infoBar = document.getElementById('modal-info-bar');
  infoBar.innerHTML = m.info;
  infoBar.classList.add('visible');

  let extraHTML = '';
  if (m.restricciones) {
    extraHTML += `<div class="restricciones-box"><strong>⚠️ Restricciones</strong>${m.restricciones}</div>`;
  }
  if (m.documentos) {
    extraHTML += `<div class="docs-box"><strong>📄 Documentos requeridos</strong><ul>${m.documentos.map(d => `<li>${d}</li>`).join('')}</ul></div>`;
  }

  const form = document.getElementById('calc-form');
  form.innerHTML = `
    <div class="form-section">
      <h3>Datos de la operación</h3>
      ${m.campos.map(c => camposHTML[c] || '').join('')}
    </div>
    ${extraHTML}
    <button class="btn-calcular" id="btnCalcular">Calcular</button>
  `;

  document.getElementById('resultados').style.display = 'none';
  cargarTRM();

  document.getElementById('btnCalcular').addEventListener('click', () => {
    const val = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const v = {
      exw: val('exw'), fob: val('fob'), transporte: val('transporte'),
      agencia: val('agencia'), certOrigen: val('certOrigen'),
      flete: val('flete'), seguro: val('seguro'), trm: val('trm'),
      meses: val('meses'), valorMenaje: val('valorMenaje'),
      valorAgregado: val('valorAgregado'),
      incoterm: document.getElementById('incoterm')?.value || 'FOB'
    };

    const primaryVal = v.exw || v.fob || v.valorMenaje;
    if (!primaryVal) { alert('Ingresa el valor principal de la operación.'); return; }
    if (!v.trm && m.campos.includes('trm')) { alert('Ingresa la TRM.'); return; }

    const filas = m.calcular(v);
    const contenido = document.getElementById('resultados-contenido');
    contenido.innerHTML = filas.map(f =>
      `<div class="resultado-item ${f.clase || ''}">
        <span>${f.label}</span>
        <span>${f.valor}</span>
      </div>`
    ).join('');

    document.getElementById('resultados').style.display = 'block';
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
  });
}

document.getElementById('exportacion-toggle').addEventListener('click', () => {
  const submenu = document.getElementById('exportacion-submenu');
  const arrow = document.querySelector('.arrow');
  submenu.classList.toggle('open');
  arrow.classList.toggle('open');
});

document.querySelectorAll('.nav-subitem').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-subitem').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    renderModal(item.dataset.modal);
  });
});

document.getElementById('exportacion-submenu').classList.add('open');
document.querySelector('.arrow').classList.add('open');
renderModal('definitiva');