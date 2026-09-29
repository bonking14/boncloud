// simulador.js — Simulador de Importación BonCloud
//
// Estima el valor en aduana, los tributos, los gastos locales, los tiempos y
// los riesgos de una importación por el Puerto de Cartagena a partir de los
// datos que escribe el usuario. Todo se calcula en el navegador con reglas de
// referencia (fletes, tiempos y gastos portuarios aproximados): sirve para
// aprender y comparar escenarios, no reemplaza una cotización ni una
// liquidación oficial.

// ───────── Parámetros de referencia ─────────
const SIM_REGIONES = {
  'China': 'asia', 'Japón': 'asia', 'Corea del Sur': 'asia', 'Taiwán': 'asia', 'India': 'asia_sur',
  'Alemania': 'europa', 'España': 'europa', 'Italia': 'europa', 'Francia': 'europa', 'Reino Unido': 'europa', 'Turquía': 'europa',
  'Estados Unidos': 'norteamerica', 'Canadá': 'norteamerica', 'México': 'norteamerica',
  'Brasil': 'suramerica'
};

// Flete marítimo de referencia hasta Cartagena (USD). Contenedores por unidad;
// carga suelta, granel y proyecto por tonelada, con un mínimo.
const SIM_FLETES = {
  asia:         { '20': 3500, '40': 5000, tonelada: 120, minimo: 400, transito: [30, 40] },
  asia_sur:     { '20': 3000, '40': 4500, tonelada: 110, minimo: 400, transito: [32, 45] },
  europa:       { '20': 2500, '40': 3500, tonelada: 90,  minimo: 300, transito: [15, 22] },
  norteamerica: { '20': 1500, '40': 2200, tonelada: 70,  minimo: 250, transito: [5, 12] },
  suramerica:   { '20': 2000, '40': 3000, tonelada: 80,  minimo: 250, transito: [12, 20] }
};

// Países de la lista con acuerdo comercial vigente con Colombia
// (preferencia arancelaria si se demuestra el origen).
const SIM_ACUERDOS = {
  'Estados Unidos': 'TLC Colombia–Estados Unidos',
  'Canadá': 'TLC Colombia–Canadá',
  'México': 'TLC Colombia–México (G-2)',
  'Corea del Sur': 'TLC Colombia–Corea',
  'Alemania': 'Acuerdo Comercial con la Unión Europea',
  'España': 'Acuerdo Comercial con la Unión Europea',
  'Italia': 'Acuerdo Comercial con la Unión Europea',
  'Francia': 'Acuerdo Comercial con la Unión Europea',
  'Reino Unido': 'Acuerdo Comercial Colombia–Reino Unido',
  'Brasil': 'Acuerdo de Complementación Económica con Mercosur (ACE 72)'
};

// Gastos locales de referencia en COP (cotiza siempre los reales)
const SIM_TERMINAL_COP = { '20': 1200000, '40': 1600000, tonelada: 60000, minimo: 400000 };
const SIM_AGENCIA_COP = { porcentaje: 0.002, minimo: 900000 };
const SIM_SEGURO_SUPUESTO = 0.005; // 0,5% del valor si no se escribe la prima real

// Qué pasa con los tributos según el régimen
const SIM_REGIMENES = {
  'Importación ordinaria': 'pagan',
  'Importación para transformación o ensamble': 'pagan',
  'Tráfico postal y envíos urgentes': 'pagan',
  'Importación con franquicia': 'exentos',
  'Reimportación en el mismo estado': 'exentos',
  'Reimportación por perfeccionamiento pasivo': 'valor_agregado',
  'Importación temporal para reexportación en el mismo estado': 'suspendidos',
  'Importación temporal para perfeccionamiento activo': 'suspendidos'
};

// ───────── Utilidades ─────────
function simEsc(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function simNum(valor) {
  const n = parseFloat(String(valor == null ? '' : valor).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}
const simMiles = (v) => Math.round(v / 1000) * 1000;
const simUSD = (v) => 'USD ' + (v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const simCOP = (v) => '$' + Math.round(v || 0).toLocaleString('es-CO') + ' COP';

// ───────── Cálculo (función pura) ─────────
function simularOperacion(d) {
  const region = SIM_REGIONES[d.pais_origen] || 'asia';
  const tarifas = SIM_FLETES[region];
  const toneladas = Math.max(d.peso_kg, 0) / 1000;
  const esContenedor = d.tipo_carga === 'Contenedor 20ft' || d.tipo_carga === 'Contenedor 40ft';
  const tamano = d.tipo_carga === 'Contenedor 40ft' ? '40' : '20';
  const incoterm = d.incoterm;

  // 1. Flete y seguro: los que escribió el usuario o los de referencia
  const fleteEstimado = esContenedor ? tarifas[tamano] : Math.max(tarifas.minimo, Math.round(toneladas * tarifas.tonelada));
  const incluyeFlete = ['CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].includes(incoterm);
  const incluyeSeguro = ['CIF', 'CIP', 'DAP', 'DPU', 'DDP'].includes(incoterm);
  const flete = incluyeFlete ? 0 : (d.flete_usd > 0 ? d.flete_usd : fleteEstimado);
  const fleteSupuesto = !incluyeFlete && !(d.flete_usd > 0);
  const seguro = incluyeSeguro ? 0 : (d.seguro_usd > 0 ? d.seguro_usd : d.valor_usd * SIM_SEGURO_SUPUESTO);
  const seguroSupuesto = !incluyeSeguro && !(d.seguro_usd > 0);
  // En EXW el comprador también paga la carga y el despacho en origen
  const gastosOrigen = incoterm === 'EXW' ? Math.max(250, Math.round(d.valor_usd * 0.01)) : 0;

  const valorAduanaUSD = d.valor_usd + gastosOrigen + flete + seguro;
  const valorAduanaCOP = valorAduanaUSD * d.trm;

  // 2. Tributos según el régimen
  const tratamiento = SIM_REGIMENES[d.regimen] || 'pagan';
  const arancelLiquidado = simMiles(valorAduanaCOP * d.arancel / 100);
  const ivaLiquidado = simMiles((valorAduanaCOP + arancelLiquidado) * d.iva / 100);
  let arancel = 0, iva = 0, suspendidos = 0, notaTributos = '';
  if (tratamiento === 'pagan') {
    arancel = arancelLiquidado; iva = ivaLiquidado;
  } else if (tratamiento === 'suspendidos') {
    suspendidos = arancelLiquidado + ivaLiquidado;
    notaTributos = 'Tributos suspendidos: no se pagan mientras la mercancía cumpla las condiciones del régimen, pero se garantizan ante la DIAN.';
  } else if (tratamiento === 'valor_agregado') {
    notaTributos = 'En la reimportación por perfeccionamiento pasivo los tributos se liquidan sobre el valor agregado en el exterior (la reparación o transformación), no sobre todo el valor. Este simulador no lo calcula.';
  } else {
    notaTributos = 'Este cálculo supone que el régimen exonera arancel e IVA. Verifica la norma que lo concede y sus condiciones.';
  }
  if (incoterm === 'DDP' && tratamiento === 'pagan') {
    notaTributos = 'En DDP los tributos los paga el vendedor, aunque la declaración se liquida igual. Se muestran para que sepas cuánto está asumiendo.';
  }
  const tributosImportador = incoterm === 'DDP' ? 0 : arancel + iva;
  const primaGarantia = suspendidos * 0.015;

  // 3. Gastos locales de referencia
  const terminal = esContenedor ? SIM_TERMINAL_COP[tamano] : Math.max(SIM_TERMINAL_COP.minimo, Math.round(toneladas * SIM_TERMINAL_COP.tonelada));
  const agencia = d.usa_agencia ? Math.max(SIM_AGENCIA_COP.minimo, Math.round(valorAduanaCOP * SIM_AGENCIA_COP.porcentaje)) : 0;

  const totalPagarCOP = tributosImportador + primaGarantia + terminal + agencia;
  const costoTotalCOP = (d.valor_usd + gastosOrigen + flete + seguro) * d.trm + totalPagarCOP;

  const costos = [
    { concepto: `Valor de la mercancía (${incoterm})`, usd: d.valor_usd },
    gastosOrigen ? { concepto: 'Carga y despacho en origen (estimado, por ser EXW)', usd: gastosOrigen } : null,
    incluyeFlete ? { concepto: 'Flete internacional', nota: `Incluido en el precio ${incoterm}` }
                 : { concepto: fleteSupuesto ? `Flete internacional (referencia ${d.tipo_carga})` : 'Flete internacional', usd: flete },
    incluyeSeguro ? { concepto: 'Seguro internacional', nota: `Incluido en el precio ${incoterm}` }
                  : { concepto: seguroSupuesto ? 'Seguro (supuesto: 0,5% del valor)' : 'Seguro internacional', usd: seguro },
    { concepto: 'Valor en aduana (CIF)', usd: valorAduanaUSD, cop: valorAduanaCOP, destacado: true },
    { concepto: `Arancel (${d.arancel}%)`, cop: tratamiento === 'pagan' ? arancel : 0, nota: tratamiento === 'pagan' ? '' : (tratamiento === 'suspendidos' ? 'Suspendido' : 'No se paga') },
    { concepto: `IVA (${d.iva}%)`, cop: tratamiento === 'pagan' ? iva : 0, nota: tratamiento === 'pagan' ? '' : (tratamiento === 'suspendidos' ? 'Suspendido' : 'No se paga') },
    suspendidos ? { concepto: 'Prima de la garantía (supuesto: 1,5% de los tributos suspendidos)', cop: primaGarantia } : null,
    { concepto: `Servicios del terminal portuario (referencia)`, cop: terminal },
    d.usa_agencia ? { concepto: 'Agencia de aduanas (referencia)', cop: agencia } : null,
    { concepto: 'Total a pagar en Colombia (tributos y gastos)', cop: totalPagarCOP, destacado: true },
    { concepto: 'Costo total puesto en el puerto (mercancía + logística + tributos + gastos)', cop: costoTotalCOP, total: true }
  ].filter(Boolean);

  // 4. Tiempos
  const [tMin, tMax] = tarifas.transito;
  const timeline = [];
  if (d.licencia_previa) {
    timeline.push({ etapa: 'Registro o licencia en la VUCE', dias_min: 5, dias_max: 15, descripcion: 'Debe estar aprobada antes de declarar; algunas entidades la exigen antes del embarque.' });
  }
  if (incoterm === 'EXW') {
    timeline.push({ etapa: 'Recogida y despacho de exportación en origen', dias_min: 3, dias_max: 7, descripcion: 'A cargo del comprador por ser EXW.' });
  }
  timeline.push(
    { etapa: 'Tránsito marítimo', dias_min: tMin, dias_max: tMax, descripcion: `Desde ${d.puerto_embarque || d.pais_origen} hasta Cartagena (referencia; depende de la ruta y los transbordos).` },
    { etapa: 'Arribo, descargue y almacenamiento', dias_min: 1, dias_max: 2, descripcion: 'El transportador debe haber transmitido el manifiesto de carga antes del arribo.' },
    { etapa: 'Declaración, pago y levante', dias_min: 1, dias_max: d.primera_importacion ? 7 : 4, descripcion: 'Levante automático en 1 día; si la DIAN ordena inspección documental o física puede tardar varios días más.' },
    { etapa: 'Retiro del puerto y entrega', dias_min: 1, dias_max: 3, descripcion: esContenedor ? 'Luego se devuelve el contenedor vacío dentro de los días libres de la naviera.' : 'Transporte hasta la bodega del importador.' }
  );
  const diasMin = timeline.reduce((t, e) => t + e.dias_min, 0);
  const diasMax = timeline.reduce((t, e) => t + e.dias_max, 0);

  // 5. Riesgos según los datos
  const riesgos = [];
  if (!d.subpartida) riesgos.push({ nivel: 'alto', titulo: 'Subpartida sin definir', descripcion: 'Sin subpartida no hay certeza sobre el arancel, el IVA ni los vistos buenos. Clasifica la mercancía antes de comprar o pide una resolución de clasificación anticipada a la DIAN.' });
  if (d.licencia_previa) riesgos.push({ nivel: 'alto', titulo: 'Requisito previo en la VUCE', descripcion: 'Si el registro o la licencia no están aprobados a tiempo, la mercancía no se puede declarar y genera almacenamiento en el puerto.' });
  if (incoterm === 'EXW') riesgos.push({ nivel: 'alto', titulo: 'EXW: despacho de exportación en origen', descripcion: `El comprador debe hacer el despacho de exportación en ${d.pais_origen}, lo que exige un agente allá. FCA suele ser mejor opción.` });
  if (incoterm === 'DDP') riesgos.push({ nivel: 'alto', titulo: 'DDP: el vendedor declara en Colombia', descripcion: 'El vendedor extranjero necesita un declarante habilitado en Colombia. Si no lo tiene, la mercancía puede quedarse en el puerto.' });
  if ((incoterm === 'FOB' || incoterm === 'CFR' || incoterm === 'CIF') && esContenedor) riesgos.push({ nivel: 'bajo', titulo: `${incoterm} con carga en contenedor`, descripcion: `La ICC recomienda ${incoterm === 'FOB' ? 'FCA' : incoterm === 'CFR' ? 'CPT' : 'CIP'} para contenedores, porque el contenedor se entrega en la terminal antes de subir al buque.` });
  if (d.primera_importacion) riesgos.push({ nivel: 'medio', titulo: 'Primera importación', descripcion: 'Verifica que el RUT tenga la calidad de importador (código 23). Los importadores nuevos tienen más probabilidad de inspección.' });
  if (region === 'asia' || region === 'asia_sur') riesgos.push({ nivel: 'medio', titulo: 'Tránsito largo con transbordos', descripcion: 'Las rutas desde Asia suelen tener transbordo; un retraso puede consumir los días libres del contenedor y generar cobros por demora.' });
  if (d.tipo_carga === 'Carga proyecto' || d.tipo_carga === 'Granel') riesgos.push({ nivel: 'medio', titulo: `Operación de ${d.tipo_carga.toLowerCase()}`, descripcion: 'Requiere coordinación previa con el terminal (equipos, muelle y ventana de atraque). Los valores de referencia de este simulador son solo orientativos.' });
  riesgos.push({ nivel: 'medio', titulo: 'Variación de la TRM', descripcion: 'Los tributos se liquidan con la TRM del último día hábil de la semana anterior a la declaración; la cifra de hoy puede cambiar.' });

  // 6. Documentos
  const acuerdo = SIM_ACUERDOS[d.pais_origen];
  const documentos = [
    { nombre: 'Factura comercial', obligatorio: true, entidad: 'Proveedor' },
    { nombre: 'Documento de transporte (B/L)', obligatorio: true, entidad: 'Naviera o agente de carga' },
    { nombre: 'Lista de empaque', obligatorio: true, entidad: 'Proveedor' },
    { nombre: 'Póliza o certificado de seguro', obligatorio: false, entidad: incluyeSeguro ? 'Vendedor' : 'Importador' },
    { nombre: 'Declaración Andina del Valor (formulario 560)', obligatorio: d.valor_usd >= 5000, entidad: 'Importador (obligatoria desde USD 5.000 FOB)' },
    { nombre: 'Declaración de importación (formulario 500)', obligatorio: true, entidad: 'Importador o agencia de aduanas' },
    { nombre: acuerdo ? `Prueba de origen para el ${acuerdo}` : 'Certificado de origen', obligatorio: false, entidad: acuerdo ? 'Solo si se pide la preferencia arancelaria' : 'No hay acuerdo comercial con este origen' },
    { nombre: 'Registro o licencia de importación', obligatorio: !!d.licencia_previa, entidad: 'VUCE' },
    { nombre: 'Mandato aduanero', obligatorio: !!d.usa_agencia, entidad: 'Si actúa una agencia de aduanas' }
  ];

  const resumen = `Importación de "${d.descripcion_mercancia}" desde ${d.pais_origen} en ${incoterm}, por ${d.tipo_carga.toLowerCase()}. ` +
    `El valor en aduana estimado es ${simUSD(valorAduanaUSD)} (${simCOP(valorAduanaCOP)} con TRM ${d.trm.toLocaleString('es-CO')}). ` +
    (tratamiento === 'pagan' && incoterm !== 'DDP' ? `Los tributos suman ${simCOP(arancel + iva)} y ` : '') +
    `el total a pagar en Colombia se estima en ${simCOP(totalPagarCOP)}. ` +
    `La operación tomaría entre ${diasMin} y ${diasMax} días desde el embarque hasta la entrega.`;

  return {
    costos, timeline, riesgos, documentos, resumen, notaTributos,
    trm: d.trm, dias: [diasMin, diasMax], acuerdo
  };
}

// ───────── Interfaz ─────────
function getSimuladorHTML() {
  return `
<div class="simulador-container" id="simulador-wizard">

  <div style="background: var(--bg-panel); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 20px;">
    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 600;">
      💡 Escenarios de práctica:
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <button class="filtro-btn" type="button" data-escenario="caso_bombas">Caso de la Ruta: bombas desde Shanghái</button>
      <button class="filtro-btn" type="button" data-escenario="usa_electronica">Servidores desde Miami (CIF)</button>
      <button class="filtro-btn" type="button" data-escenario="alemania_repuestos">Autopartes desde Hamburgo (EXW)</button>
    </div>
  </div>

  <div class="wizard-progress">
    <div class="wizard-step active" data-step="0"><div class="step-circle">1</div><small>Mercancía</small></div>
    <div class="wizard-step" data-step="1"><div class="step-circle">2</div><small>Origen y Logística</small></div>
    <div class="wizard-step" data-step="2"><div class="step-circle">3</div><small>Importador</small></div>
    <div class="wizard-step" data-step="3"><div class="step-circle">4</div><small>Confirmación</small></div>
  </div>
  <div class="wizard-panel active" data-panel="0">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Datos de la Mercancía</h3>
    <div class="sim-group"><label>Descripción de la mercancía *</label><input type="text" id="sim-desc" placeholder="Ej. Bombas de engranajes para aceite hidráulico"><div class="sim-error">Este campo es obligatorio</div></div>
    <div class="sim-row">
      <div class="sim-group"><label>Subpartida arancelaria</label><input type="text" id="sim-subpartida" placeholder="Ej. 8413.60.90.00" list="sim-subpartidas-lista"><datalist id="sim-subpartidas-lista"></datalist><div class="sim-hint" id="sim-subpartida-info" style="font-size:11px;color:var(--text-hint);margin-top:4px"></div></div>
      <div class="sim-group"><label>Valor de la mercancía según el Incoterm (USD) *</label><input type="number" id="sim-valor" placeholder="0.00" min="0" step="0.01"><div class="sim-error">Ingrese el valor en USD</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Arancel (%) *</label><input type="number" id="sim-arancel" placeholder="Según la subpartida" min="0" step="0.1"><div class="sim-error">Escriba el arancel (puede ser 0)</div></div>
      <div class="sim-group"><label>IVA (%) *</label><input type="number" id="sim-iva" value="19" min="0" step="0.1"><div class="sim-error">Escriba el IVA</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Tipo de carga *</label><select id="sim-carga"><option value="">Seleccionar...</option><option>Contenedor 20ft</option><option>Contenedor 40ft</option><option>Carga suelta</option><option>Granel</option><option>Carga proyecto</option></select><div class="sim-error">Seleccione tipo de carga</div></div>
      <div class="sim-group"><label>Peso bruto (kg) *</label><input type="number" id="sim-peso" placeholder="0" min="0"><div class="sim-error">Ingrese el peso</div></div>
    </div>
  </div>
  <div class="wizard-panel" data-panel="1">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Origen y Logística</h3>
    <div class="sim-row">
      <div class="sim-group"><label>País de origen *</label><select id="sim-pais"><option value="">Seleccionar...</option>${Object.keys(SIM_REGIONES).map(p => `<option>${p}</option>`).join('')}</select><div class="sim-error">Seleccione el país</div></div>
      <div class="sim-group"><label>Puerto de embarque *</label><input type="text" id="sim-puerto" placeholder="Ej. Shanghái, Rotterdam, Miami"><div class="sim-error">Ingrese el puerto</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Incoterm *</label><select id="sim-incoterm"><option value="">Seleccionar...</option><option>EXW</option><option>FCA</option><option>FAS</option><option>FOB</option><option>CFR</option><option>CIF</option><option>CPT</option><option>CIP</option><option>DAP</option><option>DPU</option><option>DDP</option></select><div class="sim-error">Seleccione un Incoterm</div></div>
      <div class="sim-group"><label>Régimen aduanero *</label><select id="sim-regimen"><option value="">Seleccionar...</option>${Object.keys(SIM_REGIMENES).map(r => `<option>${r}</option>`).join('')}</select><div class="sim-error">Seleccione el régimen</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Flete internacional (USD)</label><input type="number" id="sim-flete" placeholder="Vacío = valor de referencia" min="0" step="0.01"></div>
      <div class="sim-group"><label>Seguro (USD)</label><input type="number" id="sim-seguro" placeholder="Vacío = 0,5% del valor" min="0" step="0.01"></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>TRM (COP por USD) *</label><input type="number" id="sim-trm" placeholder="Cargando..." min="0" step="0.01"><div class="sim-hint" id="sim-trm-info" style="font-size:11px;color:var(--text-hint);margin-top:4px"></div><div class="sim-error">Escriba la TRM</div></div>
      <div class="sim-group"><label>Fecha estimada de embarque</label><input type="date" id="sim-fecha"></div>
    </div>
  </div>
  <div class="wizard-panel" data-panel="2">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Datos del Importador</h3>
    <div class="nit-input-group">
      <div class="sim-group" style="flex:1; margin-bottom:0;"><label>NIT del importador *</label><input type="text" id="sim-nit" placeholder="Ej. 900123456" inputmode="numeric"><div class="sim-error">Ingrese el NIT</div></div>
      <span class="nit-separator">-</span>
      <div class="sim-group" style="margin-bottom:0;"><label>DV</label><input type="text" id="sim-dv" class="nit-dv-input" readonly placeholder="—"></div>
    </div>
    <div style="margin-top:16px;"></div>
    <label class="toggle-group">
      <span>¿Usará agencia de aduanas?</span>
      <div class="toggle"><input type="checkbox" id="sim-agencia"><div class="toggle-slider"></div></div>
    </label>
    <label class="toggle-group">
      <span>¿La subpartida exige registro o licencia en la VUCE?</span>
      <div class="toggle"><input type="checkbox" id="sim-licencia"><div class="toggle-slider"></div></div>
    </label>
    <label class="toggle-group">
      <span>¿Es su primera importación?</span>
      <div class="toggle"><input type="checkbox" id="sim-primera"><div class="toggle-slider"></div></div>
    </label>
  </div>
  <div class="wizard-panel" data-panel="3">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Confirmar Datos de la Simulación</h3>
    <div id="sim-resumen-datos" style="background:var(--bg-panel);border:1px solid var(--border);border-radius:10px;padding:16px;font-size:12px;color:var(--text-muted);line-height:1.8"></div>
  </div>
  <div class="wizard-nav">
    <button class="sim-btn sim-btn-secondary" id="sim-prev" style="visibility:hidden">← Anterior</button>
    <button class="sim-btn sim-btn-primary" id="sim-next">Siguiente →</button>
  </div>
  <div id="simulador-resultado"></div>
</div>`;
}

function setupSimuladorLogic() {
  let currentStep = 0;
  const totalSteps = 4;
  const steps = document.querySelectorAll('.wizard-step');
  const panels = document.querySelectorAll('.wizard-panel');
  const prevBtn = document.getElementById('sim-prev');
  const nextBtn = document.getElementById('sim-next');
  const resultado = document.getElementById('simulador-resultado');
  let ultimoResultado = null;

  function calcularDV(nit) {
    const primos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    const digits = nit.toString().split('').reverse().map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length && i < primos.length; i++) sum += digits[i] * primos[i];
    const mod = sum % 11;
    return mod >= 2 ? 11 - mod : mod;
  }

  const nitInput = document.getElementById('sim-nit');
  const dvInput = document.getElementById('sim-dv');
  nitInput.addEventListener('input', () => {
    const v = nitInput.value.replace(/\D/g, '');
    dvInput.value = v.length >= 6 ? calcularDV(v) : '';
  });

  // Catálogo de subpartidas (si la página cargó subpartidas.js)
  const catalogo = typeof subpartidas !== 'undefined' ? subpartidas : [];
  const lista = document.getElementById('sim-subpartidas-lista');
  lista.innerHTML = catalogo.map(s => `<option value="${s.codigo}">${simEsc(s.titulo)}</option>`).join('');
  const spInput = document.getElementById('sim-subpartida');
  const spInfo = document.getElementById('sim-subpartida-info');
  spInput.addEventListener('input', () => {
    const sp = catalogo.find(s => s.codigo === spInput.value.trim());
    if (sp) {
      document.getElementById('sim-arancel').value = sp.arancel;
      document.getElementById('sim-iva').value = sp.iva;
      spInfo.textContent = `${sp.titulo}. Arancel de referencia ${sp.arancel}% e IVA ${sp.iva}%: confírmalos en el Arancel de Aduanas vigente.`;
    } else {
      spInfo.textContent = '';
    }
  });

  // TRM de referencia (no oficial)
  const trmInput = document.getElementById('sim-trm');
  const trmInfo = document.getElementById('sim-trm-info');
  fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP')
    .then(r => r.json())
    .then(data => {
      if (!trmInput.value && data && data.rates && data.rates.COP) {
        trmInput.value = data.rates.COP.toFixed(2);
        trmInfo.textContent = 'Tasa de mercado de referencia, no la TRM oficial.';
      }
    })
    .catch(() => {
      if (!trmInput.value) trmInfo.textContent = 'No se pudo cargar una tasa de referencia: escribe la TRM.';
    })
    .finally(() => { if (!trmInput.value) trmInput.placeholder = 'Ej. 4100'; });

  const requiredMap = {
    0: ['sim-desc', 'sim-valor', 'sim-arancel', 'sim-iva', 'sim-carga', 'sim-peso'],
    1: ['sim-pais', 'sim-puerto', 'sim-incoterm', 'sim-regimen', 'sim-trm'],
    2: ['sim-nit'],
    3: []
  };

  function validatePanel(idx) {
    let valid = true;
    (requiredMap[idx] || []).forEach(id => {
      const el = document.getElementById(id);
      const group = el && el.closest('.sim-group');
      const vacio = !el || !el.value.trim();
      const negativo = el && el.type === 'number' && simNum(el.value) < 0;
      const cero = el && ['sim-valor', 'sim-trm', 'sim-peso'].includes(id) && simNum(el.value) <= 0;
      const mal = vacio || negativo || cero;
      if (group) group.classList.toggle('has-error', mal);
      if (mal) valid = false;
    });
    return valid;
  }

  function updateWizard() {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < currentStep) s.classList.add('done');
      if (i === currentStep) s.classList.add('active');
    });
    panels.forEach((p, i) => p.classList.toggle('active', i === currentStep));
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    nextBtn.style.display = '';
    prevBtn.style.display = '';
    if (currentStep === totalSteps - 1) {
      nextBtn.textContent = '🚀 Simular operación';
      nextBtn.className = 'sim-btn sim-btn-submit';
      buildResumen();
    } else {
      nextBtn.textContent = 'Siguiente →';
      nextBtn.className = 'sim-btn sim-btn-primary';
    }
  }

  function collectData() {
    const g = id => (document.getElementById(id) || {}).value || '';
    const chk = id => !!(document.getElementById(id) || {}).checked;
    return {
      descripcion_mercancia: g('sim-desc').trim(),
      subpartida: g('sim-subpartida').trim(),
      valor_usd: simNum(g('sim-valor')),
      arancel: simNum(g('sim-arancel')),
      iva: simNum(g('sim-iva')),
      tipo_carga: g('sim-carga'),
      peso_kg: simNum(g('sim-peso')),
      pais_origen: g('sim-pais'),
      puerto_embarque: g('sim-puerto').trim(),
      incoterm: g('sim-incoterm'),
      regimen: g('sim-regimen'),
      flete_usd: simNum(g('sim-flete')),
      seguro_usd: simNum(g('sim-seguro')),
      trm: simNum(g('sim-trm')),
      fecha_embarque: g('sim-fecha'),
      nit: g('sim-nit').replace(/\D/g, ''),
      dv: g('sim-dv'),
      usa_agencia: chk('sim-agencia'),
      licencia_previa: chk('sim-licencia'),
      primera_importacion: chk('sim-primera')
    };
  }

  function buildResumen() {
    const d = collectData();
    const fila = (k, v) => `<div><strong style="color:var(--text-secondary)">${k}:</strong> ${simEsc(v)}</div>`;
    document.getElementById('sim-resumen-datos').innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:6px 20px">
        ${fila('Mercancía', d.descripcion_mercancia)}
        ${fila('Valor', simUSD(d.valor_usd) + ' ' + d.incoterm)}
        ${fila('Subpartida', d.subpartida || 'Sin definir')}
        ${fila('Arancel / IVA', `${d.arancel}% / ${d.iva}%`)}
        ${fila('Carga', `${d.tipo_carga}, ${d.peso_kg.toLocaleString('es-CO')} kg`)}
        ${fila('Origen', `${d.pais_origen} (${d.puerto_embarque})`)}
        ${fila('Régimen', d.regimen)}
        ${fila('TRM', d.trm.toLocaleString('es-CO'))}
        ${fila('NIT', `${d.nit}-${d.dv}`)}
        ${fila('Agencia de aduanas', d.usa_agencia ? 'Sí' : 'No, actúa directamente')}
      </div>`;
  }

  function renderResultado(r) {
    const costRows = r.costos.map(c => {
      const usd = c.usd != null ? simUSD(c.usd) : '';
      const cop = c.cop != null ? simCOP(c.cop) : (c.nota || '');
      const estilo = c.total ? ' style="font-weight:800"' : c.destacado ? ' style="font-weight:700"' : '';
      return `<tr${estilo}><td>${simEsc(c.concepto)}</td><td>${[usd, cop].filter(Boolean).join(' · ') || simEsc(c.nota || '')}</td></tr>`;
    }).join('');

    const tlHTML = r.timeline.map(t =>
      `<div class="timeline-etapa"><div class="sim-tl-dot"></div><div class="sim-tl-name">${simEsc(t.etapa)}</div><div class="sim-tl-days">${t.dias_min}-${t.dias_max} días</div><div class="sim-tl-desc">${simEsc(t.descripcion)}</div></div>`
    ).join('');

    const riskHTML = r.riesgos.map(x =>
      `<div><span class="badge-riesgo ${x.nivel}">${x.nivel.toUpperCase()}: ${simEsc(x.titulo)}</span><div class="sim-risk-desc">${simEsc(x.descripcion)}</div></div>`
    ).join('');

    const docHTML = r.documentos.map(doc =>
      `<li><span class="sim-doc-check ${doc.obligatorio ? 'si' : 'no'}">${doc.obligatorio ? '✓' : '○'}</span><span class="${doc.obligatorio ? '' : 'sim-doc-optional'}">${simEsc(doc.nombre)}</span><span class="sim-doc-entidad">${simEsc(doc.entidad)}</span></li>`
    ).join('');

    resultado.innerHTML = `
      <div class="sim-resumen"><strong style="color:var(--text-secondary)">Resumen</strong><br><br>${simEsc(r.resumen)}</div>
      <div class="resultado-card"><h4>💰 Costos estimados</h4><table class="sim-cost-table">${costRows}</table>
        ${r.notaTributos ? `<p style="font-size:11px;color:var(--text-muted);margin-top:8px">${simEsc(r.notaTributos)}</p>` : ''}
        <p style="font-size:10px;color:var(--text-hint);margin-top:8px">TRM usada: ${r.trm.toLocaleString('es-CO')} COP/USD. Cada tributo se aproxima al múltiplo de mil. Fletes, gastos del terminal y agencia son valores de referencia: cotiza los reales.</p></div>
      <div class="resultado-card"><h4>📅 Tiempos estimados (${r.dias[0]} a ${r.dias[1]} días)</h4><div class="timeline-visual">${tlHTML}</div></div>
      <div class="resultado-card"><h4>⚠️ Riesgos identificados</h4>${riskHTML}</div>
      <div class="resultado-card"><h4>📋 Documentos</h4><ul class="sim-doc-list">${docHTML}</ul></div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px">
        <button class="sim-btn sim-btn-secondary" type="button" id="sim-btn-editar">← Editar datos</button>
        <button class="btn-pdf" type="button" id="sim-btn-descargar-pdf">📄 Descargar informe PDF</button>
      </div>`;
    resultado.classList.add('active');

    document.getElementById('sim-btn-descargar-pdf').addEventListener('click', () => generarPDF(r));
    document.getElementById('sim-btn-editar').addEventListener('click', () => {
      resultado.classList.remove('active');
      resultado.innerHTML = '';
      currentStep = 0;
      updateWizard();
    });
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function generarPDF(r) {
    if (!window.jspdf) { alert('No se pudo cargar la librería de PDF. Revisa tu conexión.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const hoy = new Date();
    let y = 20;

    doc.setFontSize(16); doc.setTextColor(30, 58, 95); doc.text('BonCloud', 14, y);
    doc.setFontSize(14); doc.setTextColor(50); doc.text('Simulación de importación', 196, y, { align: 'right' });
    y += 6;
    doc.setFontSize(10); doc.setTextColor(100); doc.text(`Fecha: ${hoy.toLocaleDateString('es-CO')}`, 196, y, { align: 'right' });
    y += 14;

    doc.setFontSize(12); doc.setTextColor(30, 58, 95); doc.text('Resumen', 14, y);
    y += 6;
    doc.setFontSize(10); doc.setTextColor(60);
    const lineas = doc.splitTextToSize(r.resumen, 180);
    doc.text(lineas, 14, y);
    y += lineas.length * 5 + 8;

    doc.setFontSize(12); doc.setTextColor(30, 58, 95); doc.text('Costos estimados', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Concepto', 'USD', 'COP']],
      body: r.costos.map(c => [c.concepto, c.usd != null ? simUSD(c.usd) : '', c.cop != null ? simCOP(c.cop) : (c.nota || '')]),
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 95] },
      didParseCell: (cell) => {
        const fila = r.costos[cell.row.index];
        if (cell.section === 'body' && fila && (fila.total || fila.destacado)) cell.cell.styles.fontStyle = 'bold';
      }
    });
    y = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(12); doc.setTextColor(30, 58, 95); doc.text('Tiempos', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Etapa', 'Días mín.', 'Días máx.', 'Descripción']],
      body: r.timeline.map(t => [t.etapa, t.dias_min, t.dias_max, t.descripcion]),
      theme: 'grid', headStyles: { fillColor: [30, 58, 95] }
    });
    y = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(12); doc.setTextColor(30, 58, 95); doc.text('Riesgos', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Nivel', 'Riesgo', 'Descripción']],
      body: r.riesgos.map(x => [x.nivel.toUpperCase(), x.titulo, x.descripcion]),
      theme: 'grid', headStyles: { fillColor: [30, 58, 95] },
      didParseCell: (cell) => {
        if (cell.section === 'body' && cell.column.index === 0) {
          const colores = { ALTO: [252, 165, 165], MEDIO: [253, 230, 138], BAJO: [134, 239, 172] };
          if (colores[cell.cell.raw]) cell.cell.styles.fillColor = colores[cell.cell.raw];
          cell.cell.styles.fontStyle = 'bold';
        }
      }
    });
    y = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(12); doc.setTextColor(30, 58, 95); doc.text('Documentos', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Documento', 'Obligatorio', 'Observación']],
      body: r.documentos.map(d => [d.nombre, d.obligatorio ? 'Sí' : 'No', d.entidad]),
      theme: 'grid', headStyles: { fillColor: [30, 58, 95] }
    });

    const paginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150);
      doc.text('Simulación educativa con valores de referencia. Confirme tarifas, fletes y requisitos antes de operar. | BonCloud', 105, 290, { align: 'center' });
    }
    doc.save(`simulacion-boncloud-${hoy.toISOString().slice(0, 10).replace(/-/g, '')}.pdf`);
  }

  function runSimulation() {
    for (let i = 0; i < totalSteps - 1; i++) {
      if (!validatePanel(i)) { currentStep = i; updateWizard(); return; }
    }
    ultimoResultado = simularOperacion(collectData());
    panels.forEach(p => p.classList.remove('active'));
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    renderResultado(ultimoResultado);
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) {
      if (!validatePanel(currentStep)) return;
      currentStep++;
      updateWizard();
    } else {
      runSimulation();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; updateWizard(); }
  });

  document.querySelectorAll('#simulador-wizard input, #simulador-wizard select').forEach(el => {
    el.addEventListener('input', () => {
      const g = el.closest('.sim-group');
      if (g) g.classList.remove('has-error');
    });
  });

  document.querySelectorAll('[data-escenario]').forEach(btn => {
    btn.addEventListener('click', () => precargarEscenario(btn.dataset.escenario));
  });

  updateWizard();

  // La Ruta de Aprendizaje abre esta página con ?escenario=caso_bombas
  const escenario = new URLSearchParams(window.location.search).get('escenario');
  if (escenario) precargarEscenario(escenario);
}

const SIM_ESCENARIOS = {
  caso_bombas: {
    desc: 'Bombas de engranajes para aceite hidráulico, sin motor (500 unidades)',
    subpartida: '8413.60.90.00', valor: 60000, arancel: 5, iva: 19,
    carga: 'Contenedor 20ft', peso: 9000, pais: 'China', puerto: 'Shanghái',
    incoterm: 'FOB', regimen: 'Importación ordinaria', flete: 3500, seguro: 300, trm: 4100,
    nit: '900123456', agencia: false
  },
  usa_electronica: {
    desc: 'Servidores informáticos y racks de procesamiento de datos',
    subpartida: '8471.50.00.00', valor: 28000, arancel: 0, iva: 19,
    carga: 'Contenedor 20ft', peso: 3400, pais: 'Estados Unidos', puerto: 'Miami',
    incoterm: 'CIF', regimen: 'Importación ordinaria', flete: '', seguro: '', trm: '',
    nit: '800987654', agencia: true
  },
  alemania_repuestos: {
    desc: 'Partes de carrocería para vehículos (paneles, bisagras y soportes)',
    subpartida: '8708.29.90.00', valor: 15500, arancel: 15, iva: 19,
    carga: 'Carga suelta', peso: 850, pais: 'Alemania', puerto: 'Hamburgo',
    incoterm: 'EXW', regimen: 'Importación ordinaria', flete: '', seguro: '', trm: '',
    nit: '901456789', agencia: true
  }
};

function precargarEscenario(tipo) {
  const esc = SIM_ESCENARIOS[tipo];
  if (!esc) return;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('sim-desc', esc.desc);
  setVal('sim-subpartida', esc.subpartida);
  const spInput = document.getElementById('sim-subpartida');
  if (spInput) spInput.dispatchEvent(new Event('input'));
  setVal('sim-valor', esc.valor);
  setVal('sim-arancel', esc.arancel);
  setVal('sim-iva', esc.iva);
  setVal('sim-carga', esc.carga);
  setVal('sim-peso', esc.peso);
  setVal('sim-pais', esc.pais);
  setVal('sim-puerto', esc.puerto);
  setVal('sim-incoterm', esc.incoterm);
  setVal('sim-regimen', esc.regimen);
  setVal('sim-flete', esc.flete);
  setVal('sim-seguro', esc.seguro);
  if (esc.trm) setVal('sim-trm', esc.trm);
  setVal('sim-nit', esc.nit);
  const agencia = document.getElementById('sim-agencia');
  if (agencia) agencia.checked = esc.agencia;
  ['sim-licencia', 'sim-primera'].forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
  const nitInput = document.getElementById('sim-nit');
  if (nitInput) nitInput.dispatchEvent(new Event('input'));
  document.querySelectorAll('#simulador-wizard .has-error').forEach(g => g.classList.remove('has-error'));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simularOperacion };
}
