// simulador.js — Simulador de Importación BonCloud

function getSimuladorHTML() {
  return `
<div class="simulador-container" id="simulador-wizard">
  <div class="wizard-progress">
    <div class="wizard-step active" data-step="0"><div class="step-circle">1</div><small>Mercancía</small></div>
    <div class="wizard-step" data-step="1"><div class="step-circle">2</div><small>Origen y Logística</small></div>
    <div class="wizard-step" data-step="2"><div class="step-circle">3</div><small>Importador</small></div>
    <div class="wizard-step" data-step="3"><div class="step-circle">4</div><small>Confirmación</small></div>
  </div>
  <div class="wizard-panel active" data-panel="0">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Datos de la Mercancía</h3>
    <div class="sim-group"><label>Descripción de la mercancía *</label><input type="text" id="sim-desc" placeholder="Ej. Maquinaria industrial para procesamiento"><div class="sim-error">Este campo es obligatorio</div></div>
    <div class="sim-row">
      <div class="sim-group"><label>Subpartida arancelaria</label><input type="text" id="sim-subpartida" placeholder="Ej. 8479.89.00.00 (opcional)"></div>
      <div class="sim-group"><label>Valor mercancía (USD) *</label><input type="number" id="sim-valor" placeholder="0.00"><div class="sim-error">Ingrese el valor en USD</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Tipo de carga *</label><select id="sim-carga"><option value="">Seleccionar...</option><option>Contenedor 20ft</option><option>Contenedor 40ft</option><option>Carga suelta</option><option>Granel</option><option>Carga proyecto</option></select><div class="sim-error">Seleccione tipo de carga</div></div>
      <div class="sim-group"><label>Peso bruto (kg) *</label><input type="number" id="sim-peso" placeholder="0"><div class="sim-error">Ingrese el peso</div></div>
    </div>
  </div>
  <div class="wizard-panel" data-panel="1">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Origen y Logística</h3>
    <div class="sim-row">
      <div class="sim-group"><label>País de origen *</label><select id="sim-pais"><option value="">Seleccionar...</option><option>China</option><option>Estados Unidos</option><option>Alemania</option><option>Japón</option><option>Corea del Sur</option><option>India</option><option>Brasil</option><option>México</option><option>España</option><option>Italia</option><option>Francia</option><option>Reino Unido</option><option>Canadá</option><option>Taiwán</option><option>Turquía</option></select><div class="sim-error">Seleccione el país</div></div>
      <div class="sim-group"><label>Puerto de embarque *</label><input type="text" id="sim-puerto" placeholder="Ej. Shanghai, Rotterdam, Miami"><div class="sim-error">Ingrese el puerto</div></div>
    </div>
    <div class="sim-row">
      <div class="sim-group"><label>Incoterm *</label><select id="sim-incoterm"><option value="">Seleccionar...</option><option>EXW</option><option>FCA</option><option>FAS</option><option>FOB</option><option>CFR</option><option>CIF</option><option>CPT</option><option>CIP</option><option>DAP</option><option>DPU</option><option>DDP</option></select><div class="sim-error">Seleccione un Incoterm</div></div>
      <div class="sim-group"><label>Régimen aduanero *</label><select id="sim-regimen"><option value="">Seleccionar...</option><option>Importación ordinaria</option><option>Importación con franquicia</option><option>Reimportación por perfeccionamiento pasivo</option><option>Reimportación en el mismo estado</option><option>Importación temporal para reexportación en el mismo estado</option><option>Importación temporal para perfeccionamiento activo</option><option>Importación para transformación o ensamble</option><option>Tráfico postal y envíos urgentes</option></select><div class="sim-error">Seleccione el régimen</div></div>
    </div>
    <div class="sim-group"><label>Fecha estimada de embarque</label><input type="date" id="sim-fecha"></div>
  </div>
  <div class="wizard-panel" data-panel="2">
    <h3 style="color:var(--text-secondary);margin-bottom:16px">Datos del Importador</h3>
    <div class="nit-input-group">
      <div class="sim-group" style="flex:1; margin-bottom:0;"><label>NIT del importador *</label><input type="text" id="sim-nit" placeholder="Ej. 901234567"><div class="sim-error">Ingrese el NIT</div></div>
      <span class="nit-separator">-</span>
      <div class="sim-group" style="margin-bottom:0;"><label>DV</label><input type="text" id="sim-dv" class="nit-dv-input" readonly placeholder="—"></div>
    </div>
    <div style="margin-top:16px;"></div>
    <label class="toggle-group">
      <span>¿Requiere licencia previa?</span>
      <div class="toggle">
        <input type="checkbox" id="sim-licencia">
        <div class="toggle-slider"></div>
      </div>
    </label>
    <label class="toggle-group">
      <span>¿Primera importación de esta subpartida?</span>
      <div class="toggle">
        <input type="checkbox" id="sim-primera">
        <div class="toggle-slider"></div>
      </div>
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
  <div class="sim-loader" id="sim-loader"><div class="sim-spinner"></div><p>Analizando operación...</p><p style="font-size:11px;margin-top:6px;color:var(--text-hint)">Consultando normativa aduanera colombiana y estimando costos</p></div>
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
  const loader = document.getElementById('sim-loader');
  const resultado = document.getElementById('simulador-resultado');

  function calcularDV(nit) {
    const primos = [3,7,13,17,19,23,29,37,41,43,47,53,59,67,71];
    const digits = nit.toString().split('').reverse().map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) sum += digits[i] * primos[i];
    const mod = sum % 11;
    return mod >= 2 ? 11 - mod : mod;
  }

  // Auto-calc DV
  const nitInput = document.getElementById('sim-nit');
  const dvInput = document.getElementById('sim-dv');
  if (nitInput) {
    nitInput.addEventListener('input', () => {
      const v = nitInput.value.replace(/\D/g, '');
      dvInput.value = v.length >= 6 ? calcularDV(v) : '';
    });
  }

  // Required fields per panel
  const requiredMap = {
    0: ['sim-desc','sim-valor','sim-carga','sim-peso'],
    1: ['sim-pais','sim-puerto','sim-incoterm','sim-regimen'],
    2: ['sim-nit'],
    3: []
  };

  function validatePanel(idx) {
    const fields = requiredMap[idx] || [];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      const group = el?.closest('.sim-group');
      if (!el || !el.value.trim()) {
        if (group) group.classList.add('has-error');
        valid = false;
      } else {
        if (group) group.classList.remove('has-error');
      }
    });
    return valid;
  }

  function updateWizard() {
    steps.forEach((s, i) => {
      s.classList.remove('active','done');
      if (i < currentStep) s.classList.add('done');
      if (i === currentStep) s.classList.add('active');
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === currentStep);
    });
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    if (currentStep === totalSteps - 1) {
      nextBtn.textContent = '🚀 Simular operación';
      nextBtn.className = 'sim-btn sim-btn-submit';
      buildResumen();
    } else {
      nextBtn.textContent = 'Siguiente →';
      nextBtn.className = 'sim-btn sim-btn-primary';
    }
  }

  function buildResumen() {
    const box = document.getElementById('sim-resumen-datos');
    if (!box) return;
    const g = id => document.getElementById(id)?.value || '—';
    box.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 20px">
        <div><strong style="color:var(--text-secondary)">Mercancía:</strong> ${g('sim-desc')}</div>
        <div><strong style="color:var(--text-secondary)">Valor:</strong> USD ${parseFloat(g('sim-valor')||0).toLocaleString('en-US',{minimumFractionDigits:2})}</div>
        <div><strong style="color:var(--text-secondary)">Subpartida:</strong> ${g('sim-subpartida')||'A inferir'}</div>
        <div><strong style="color:var(--text-secondary)">Carga:</strong> ${g('sim-carga')}</div>
        <div><strong style="color:var(--text-secondary)">Peso:</strong> ${g('sim-peso')} kg</div>
        <div><strong style="color:var(--text-secondary)">País:</strong> ${g('sim-pais')}</div>
        <div><strong style="color:var(--text-secondary)">Puerto:</strong> ${g('sim-puerto')}</div>
        <div><strong style="color:var(--text-secondary)">Incoterm:</strong> ${g('sim-incoterm')}</div>
        <div><strong style="color:var(--text-secondary)">Régimen:</strong> ${g('sim-regimen')}</div>
        <div><strong style="color:var(--text-secondary)">NIT:</strong> ${g('sim-nit')}-${g('sim-dv')}</div>
        <div><strong style="color:var(--text-secondary)">Fecha embarque:</strong> ${g('sim-fecha')||'No especificada'}</div>
      </div>`;
  }

  function collectData() {
    const g = id => document.getElementById(id)?.value || '';
    return {
      descripcion_mercancia: g('sim-desc'),
      subpartida: g('sim-subpartida'),
      valor_usd: parseFloat(g('sim-valor')) || 0,
      tipo_carga: g('sim-carga'),
      peso_kg: parseFloat(g('sim-peso')) || 0,
      pais_origen: g('sim-pais'),
      puerto_embarque: g('sim-puerto'),
      incoterm: g('sim-incoterm'),
      regimen: g('sim-regimen'),
      nit: g('sim-nit'),
      licencia_previa: document.getElementById('sim-licencia')?.checked || false,
      primera_importacion: document.getElementById('sim-primera')?.checked || false,
      fecha_embarque: g('sim-fecha')
    };
  }

  function renderResultado(data) {
    const c = data.costos;
    // Costos table
    let costRows = '';
    const labels = {
      flete_internacional_usd: 'Flete internacional',
      seguro_usd: 'Seguro',
      valor_cif_usd: 'Valor CIF',
      arancel_cop: 'Arancel (COP)',
      iva_cop: 'IVA importación (COP)',
      agencia_aduanas_cop: 'Agencia de aduanas (COP)',
      almacenaje_estimado_cop: 'Almacenaje estimado (COP)'
    };
    for (const [k,lbl] of Object.entries(labels)) {
      const v = c[k];
      const fmt = k.includes('cop')
        ? '$' + (v||0).toLocaleString('es-CO',{minimumFractionDigits:0})+ ' COP'
        : 'USD ' + (v||0).toLocaleString('en-US',{minimumFractionDigits:2});
      costRows += `<tr><td>${lbl}</td><td>${fmt}</td></tr>`;
    }
    costRows += `<tr><td>TOTAL ESTIMADO</td><td>USD ${(c.total_usd||0).toLocaleString('en-US',{minimumFractionDigits:2})} / $${(c.total_cop||0).toLocaleString('es-CO')} COP</td></tr>`;

    // Timeline
    let tlHTML = '';
    (data.timeline||[]).forEach(t => {
      tlHTML += `<div class="timeline-etapa"><div class="sim-tl-dot"></div><div class="sim-tl-name">${t.etapa}</div><div class="sim-tl-days">${t.dias_min}-${t.dias_max} días</div><div class="sim-tl-desc">${t.descripcion||''}</div></div>`;
    });

    // Riesgos
    let riskHTML = '';
    (data.riesgos||[]).forEach(r => {
      const cls = r.nivel === 'alto' ? 'alto' : r.nivel === 'medio' ? 'medio' : 'bajo';
      riskHTML += `<div><span class="badge-riesgo ${cls}">${r.nivel.toUpperCase()}: ${r.titulo}</span><div class="sim-risk-desc">${r.descripcion}</div></div>`;
    });

    // Documentos
    let docHTML = '';
    (data.documentos||[]).forEach(d => {
      const ob = d.obligatorio;
      docHTML += `<li><span class="sim-doc-check ${ob?'si':'no'}">${ob?'✓':'○'}</span><span class="${ob?'':'sim-doc-optional'}">${d.nombre}</span><span class="sim-doc-entidad">${d.entidad||''}</span></li>`;
    });

    resultado.innerHTML = `
      ${data.resumen_ejecutivo ? `<div class="sim-resumen"><strong style="color:var(--text-secondary)">Resumen Ejecutivo</strong><br><br>${data.resumen_ejecutivo}</div>` : ''}
      ${data.subpartida_sugerida ? `<p style="font-size:12px;color:var(--text-muted);margin-bottom:14px">Subpartida sugerida: <strong style="color:var(--text-accent)">${data.subpartida_sugerida}</strong></p>` : ''}
      <div class="resultado-card"><h4>💰 Costos Estimados</h4><table class="sim-cost-table">${costRows}</table><p style="font-size:10px;color:var(--text-hint);margin-top:8px">Tasa de cambio referencia: ${c.tasa_cambio_referencia||4200} COP/USD</p></div>
      <div class="resultado-card"><h4>📅 Timeline Estimado</h4><div class="timeline-visual">${tlHTML}</div></div>
      <div class="resultado-card"><h4>⚠️ Riesgos Identificados</h4>${riskHTML}</div>
      <div class="resultado-card"><h4>📋 Documentos Requeridos</h4><ul class="sim-doc-list">${docHTML}</ul></div>
      <div style="text-align:center;margin-top:20px"><button class="btn-pdf" id="sim-btn-descargar-pdf">📄 Descargar informe PDF</button></div>`;
    resultado.classList.add('active');

    setTimeout(() => {
      const btnPdf = document.getElementById('sim-btn-descargar-pdf');
      if (btnPdf) {
        btnPdf.addEventListener('click', () => {
          generarPDF(data);
        });
      }
    }, 100);
  }

  function generarPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const dateDisplay = today.toLocaleDateString();

    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 95);
    doc.text("BonCloud", 14, y);
    
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text("Simulación de Operación Logística", 196, y, { align: 'right' });
    
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha: ${dateDisplay}`, 196, y, { align: 'right' });
    
    y += 15;

    // Seccion 1
    if (data.resumen_ejecutivo) {
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 95);
      doc.text("Resumen Ejecutivo", 14, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(60);
      const splitText = doc.splitTextToSize(data.resumen_ejecutivo, 180);
      doc.text(splitText, 14, y);
      y += (splitText.length * 5) + 10;
    }

    // Seccion 2
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Costos Estimados", 14, y);
    y += 4;
    
    const c = data.costos || {};
    const fmt = (v) => (v||0).toLocaleString('en-US',{minimumFractionDigits:2});
    const fmtCop = (v) => (v||0).toLocaleString('es-CO',{minimumFractionDigits:0});
    const tasa = c.tasa_cambio_referencia || 4200;
    
    const toCop = (usd) => usd * tasa;
    const toUsd = (cop) => cop / tasa;

    const costsData = [
      ['Flete internacional', 'USD ' + fmt(c.flete_internacional_usd), '$' + fmtCop(toCop(c.flete_internacional_usd))],
      ['Seguro', 'USD ' + fmt(c.seguro_usd), '$' + fmtCop(toCop(c.seguro_usd))],
      ['Valor CIF', 'USD ' + fmt(c.valor_cif_usd), '$' + fmtCop(toCop(c.valor_cif_usd))],
      ['Arancel', 'USD ' + fmt(toUsd(c.arancel_cop)), '$' + fmtCop(c.arancel_cop)],
      ['IVA importación', 'USD ' + fmt(toUsd(c.iva_cop)), '$' + fmtCop(c.iva_cop)],
      ['Agencia de aduanas', 'USD ' + fmt(toUsd(c.agencia_aduanas_cop)), '$' + fmtCop(c.agencia_aduanas_cop)],
      ['Almacenaje estimado', 'USD ' + fmt(toUsd(c.almacenaje_estimado_cop)), '$' + fmtCop(c.almacenaje_estimado_cop)],
      ['TOTAL ESTIMADO', 'USD ' + fmt(c.total_usd), '$' + fmtCop(c.total_cop)]
    ];

    doc.autoTable({
      startY: y,
      head: [['Concepto', 'Valor USD', 'Valor COP']],
      body: costsData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 95] },
      willDrawCell: function(data) {
        if (data.row.index === costsData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [30, 58, 95];
        }
      }
    });
    y = doc.lastAutoTable.finalY + 15;

    // Seccion 3
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Línea de Tiempo", 14, y);
    
    const tlData = (data.timeline || []).map(t => [t.etapa, t.dias_min, t.dias_max, t.descripcion || '']);
    doc.autoTable({
      startY: y + 4,
      head: [['Etapa', 'Días mínimo', 'Días máximo', 'Descripción']],
      body: tlData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 95] }
    });
    y = doc.lastAutoTable.finalY + 15;

    // Seccion 4
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Riesgos Identificados", 14, y);
    
    const rData = (data.riesgos || []).map(r => [r.nivel.toUpperCase(), r.titulo, r.descripcion]);
    doc.autoTable({
      startY: y + 4,
      head: [['Nivel', 'Riesgo', 'Descripción']],
      body: rData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 95] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 0) {
          const val = data.cell.raw;
          if (val === 'ALTO') data.cell.styles.fillColor = [252, 165, 165];
          else if (val === 'MEDIO') data.cell.styles.fillColor = [253, 230, 138];
          else if (val === 'BAJO') data.cell.styles.fillColor = [134, 239, 172];
          data.cell.styles.textColor = [0,0,0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    y = doc.lastAutoTable.finalY + 15;

    // Seccion 5
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Documentos Requeridos", 14, y);
    
    const dData = (data.documentos || []).map(d => [d.nombre, d.obligatorio ? 'Sí' : 'No', d.entidad || 'N/A']);
    doc.autoTable({
      startY: y + 4,
      head: [['Documento', 'Obligatorio', 'Entidad']],
      body: dData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 95] }
    });

    // Pie de página global
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Simulación orientativa — consulte con un agente de aduanas certificado | BonCloud", 105, 290, { align: 'center' });
    }

    doc.save(`simulacion-boncloud-${dateStr}.pdf`);
  }

  async function runSimulation() {
    const data = collectData();
    // Hide wizard nav and panels
    panels.forEach(p => p.classList.remove('active'));
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    loader.classList.add('active');
    resultado.classList.remove('active');

    try {
      const API = 'https://boncloud-api.onrender.com/api';
      const resp = await fetch(`${API}/simulador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      loader.classList.remove('active');
      if (json.ok && json.resultado) {
        renderResultado(json.resultado);
      } else {
        resultado.innerHTML = `<div class="sim-resumen" style="border-color:#7f1d1d"><strong style="color:#fca5a5">Error en la simulación</strong><br><br>${json.error || 'No se pudo procesar la operación. Verifique los datos e intente nuevamente.'}</div>`;
        resultado.classList.add('active');
      }
    } catch (err) {
      console.warn("Backend falló. Usando modo offline (hardcoded).", err);
      loader.classList.remove('active');
      
      const valorUSD = data.valor_usd || 10000;
      const fleteUSD = 2500;
      const seguroUSD = valorUSD * 0.005;
      const cifUSD = valorUSD + fleteUSD + seguroUSD;
      const tasaCambio = 4200;
      const arancelCOP = cifUSD * tasaCambio * 0.10; // 10% arancel promedio
      const ivaCOP = (cifUSD * tasaCambio + arancelCOP) * 0.19;
      const agenciaCOP = 1500000;
      const almacenajeCOP = 800000;
      const totalCOP = (cifUSD * tasaCambio) + arancelCOP + ivaCOP + agenciaCOP + almacenajeCOP;

      const fallbackResultado = {
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
          { etapa: "Tránsito Internacional", dias_min: 20, dias_max: 35, descripcion: `Transporte marítimo desde ${data.pais_origen || 'origen'}` },
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
          { nombre: "Licencia Previa", obligatorio: data.licencia_previa, entidad: "VUCE / MINCIT" }
        ],
        subpartida_sugerida: data.subpartida || "8479.89.00.00",
        resumen_ejecutivo: `Simulación local (Modo Offline) para la mercancía "${data.descripcion_mercancia || 'general'}". El servidor remoto no está disponible, calculando con parámetros estándar.`
      };

      renderResultado(fallbackResultado);
    }
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
    if (currentStep > 0) {
      currentStep--;
      updateWizard();
    }
  });

  // Clear errors on input
  document.querySelectorAll('.sim-group input, .sim-group select').forEach(el => {
    el.addEventListener('input', () => {
      el.closest('.sim-group')?.classList.remove('has-error');
    });
  });

  updateWizard();
}
