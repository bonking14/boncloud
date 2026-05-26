// ========== IMPORTACIÓN MODAL - SOLO 3 MODALIDADES ==========

function toNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    let str = String(value).trim();
    if (str.includes(',') && str.includes('.')) {
        const lastDot = str.lastIndexOf('.');
        const lastComma = str.lastIndexOf(',');
        if (lastComma > lastDot) {
            str = str.replace(/\./g, '');
            str = str.replace(',', '.');
        } else {
            str = str.replace(/,/g, '');
        }
    } else if (str.includes(',') && !str.includes('.')) {
        str = str.replace(',', '.');
    } else if (str.includes('.') && (str.match(/\./g) || []).length > 1) {
        str = str.replace(/\./g, '');
    }
    str = str.replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
}

function redondear(valor) { return Math.round(valor); }

function formatUSD(valor) {
    return `USD ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCOP(valor) {
    return `COP ${redondear(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// ========== 1. ORDINARIA ==========
function calcularOrdinaria(datos) {
    const seguro = datos.seguro > 0 ? datos.seguro : datos.fob * 0.005;
    const cifUSD = datos.fob + datos.flete + seguro;
    const baseArancelariaCOP = cifUSD * datos.trm;
    const totalArancel = baseArancelariaCOP * (datos.arancel / 100);
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = baseIVA * 0.19;
    const totalImpuestos = totalArancel + totalIVA;
    const gastosNac = (datos.agencia || 0) + (datos.bodegaje || 0) + (datos.transporte || 0);
    const totalPagar = totalImpuestos + gastosNac;

    return {
        fob: datos.fob, flete: datos.flete, seguro, cifUSD,
        arancelPorcentaje: datos.arancel, trm: datos.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        totalArancel: Math.round(totalArancel),
        baseIVA: Math.round(baseIVA),
        totalIVA: Math.round(totalIVA),
        totalImpuestos: Math.round(totalImpuestos),
        gastosNacionalizacion: Math.round(gastosNac),
        totalPagar: Math.round(totalPagar)
    };
}

// ========== 2. FRANQUICIA (viajero) ==========
function calcularFranquicia(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const gastos = (v.agencia || 0) + (v.bodegaje || 0);
    const totalPagar = Math.round(baseArancelariaCOP + gastos);
    
    return {
        fob: v.fob, flete: v.flete, seguro, cifUSD,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        gastos: Math.round(gastos),
        totalPagar: totalPagar,
        trm: v.trm
    };
}

// ========== 3. TEMPORAL CORTO PLAZO ==========
function calcularTemporalCorto(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const totalArancel = baseArancelariaCOP * (v.arancel / 100);
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = baseIVA * 0.19;
    const tributosSuspendidos = totalArancel + totalIVA;
    const poliza = tributosSuspendidos * 0.015;
    const gastos = (v.agencia || 0) + (v.bodegaje || 0);
    const totalPagar = Math.round(baseArancelariaCOP + gastos + poliza);
    
    return {
        fob: v.fob, flete: v.flete, seguro, cifUSD,
        arancelPorcentaje: v.arancel, trm: v.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        tributosSuspendidos: Math.round(tributosSuspendidos),
        poliza: Math.round(poliza),
        gastos: Math.round(gastos),
        totalPagar: totalPagar
    };
}

// ========== MODALIDADES (SOLO 3) ==========
const modalidades = {
    ordinaria: {
        titulo: 'Importación Ordinaria',
        badge: 'C100',
        subtitulo: 'Mercancías para consumo definitivo en Colombia',
        info: `<div class="info-collapsible"><div class="info-header" id="infoHeader"><span class="info-arrow">▶</span><strong>Secuencia de cálculo</strong></div><div class="info-content" id="infoContent" style="display: none;"><ol><li>Valor FOB (USD)</li><li>+ Flete</li><li>+ Seguro (0.5% del FOB)</li><li>= Valor CIF USD</li><li>× TRM = Base Arancelaria COP</li><li>× %Arancel = Total Arancel</li><li>Base + Arancel = Base IVA</li><li>× 19% = Total IVA</li><li>+ Gastos nacionalización = TOTAL</li></ol></div></div>`,
        campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'bodegaje', 'transporte'],
        calcular: (v) => {
            const r = calcularOrdinaria(v);
            return [
                { label: '1. Valor FOB', valor: formatUSD(r.fob) },
                { label: '2. + Flete', valor: formatUSD(r.flete) },
                { label: '3. + Seguro', valor: formatUSD(r.seguro) },
                { label: '4. = Valor CIF USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: `5. Base Arancelaria (× TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.baseArancelariaCOP) },
                { label: `6. + Arancel (${r.arancelPorcentaje}%)`, valor: formatCOP(r.totalArancel) },
                { label: '7. = Base IVA', valor: formatCOP(r.baseIVA), clase: 'destacado' },
                { label: '8. + IVA (19%)', valor: formatCOP(r.totalIVA) },
                { label: '9. = Total Impuestos', valor: formatCOP(r.totalImpuestos), clase: 'destacado' },
                { label: '10. + Gastos nacionalización', valor: formatCOP(r.gastosNacionalizacion) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },
    
    franquicia: {
        titulo: 'Importación con Franquicia',
        badge: 'C110',
        subtitulo: 'Exención total de tributos (viajero: hasta USD 200)',
        info: `<strong>¿Cuándo se aplica?</strong> Viajeros internacionales. Exento de arancel e IVA.`,
        campos: ['fob', 'flete', 'seguro', 'trm', 'agencia', 'bodegaje'],
        calcular: (v) => {
            const r = calcularFranquicia(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Base Arancelaria COP', valor: formatCOP(r.baseArancelariaCOP) },
                { label: 'Arancel', valor: '$ 0 — EXENTO (franquicia)', clase: 'exento' },
                { label: 'IVA', valor: '$ 0 — EXENTO (franquicia)', clase: 'exento' },
                { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },
    
    'temporal-corto': {
        titulo: 'Importación Temporal Corto Plazo',
        badge: 'C150',
        subtitulo: 'Hasta 6 meses — tributos suspendidos + póliza',
        info: `<strong>¿Cuándo se usa?</strong> Para ferias, exposiciones, eventos. Tributos suspendidos, se paga póliza del 1.5%.`,
        campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'bodegaje'],
        calcular: (v) => {
            const r = calcularTemporalCorto(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Base Arancelaria COP', valor: formatCOP(r.baseArancelariaCOP) },
                { label: `Arancel (${r.arancelPorcentaje}%) — SUSPENDIDO`, valor: formatCOP(r.tributosSuspendidos * r.arancelPorcentaje / (r.arancelPorcentaje + 19)), clase: 'suspendido' },
                { label: 'IVA (19%) — SUSPENDIDO', valor: formatCOP(r.tributosSuspendidos * 19 / (r.arancelPorcentaje + 19)), clase: 'suspendido' },
                { label: 'Póliza de garantía (1.5%)', valor: formatCOP(r.poliza) },
                { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    }
};

// ========== CAMPOS HTML ==========
const camposHTML = {
    fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" step="0.01" id="fob" placeholder="Ej: 125000" min="0"></div>`,
    flete: `<div class="input-group"><label>Flete internacional (USD)</label><input type="number" step="0.01" id="flete" placeholder="Ej: 7500" min="0"></div>`,
    seguro: `<div class="input-group"><label>Seguro (USD) <span class="hint">— 0 = 0.5% del FOB</span></label><input type="number" step="0.01" id="seguro" placeholder="0" min="0"></div>`,
    arancel: `<div class="input-group"><label>Arancel (%)</label><input type="number" step="0.01" id="arancel" placeholder="15" value="15" min="0"></div>`,
    trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" step="0.01" id="trm" placeholder="Ej: 4000"><span class="trm-status" id="trm-status"></span></div>`,
    agencia: `<div class="input-group"><label>Agencia aduanera (COP)</label><input type="number" step="0.01" id="agencia" placeholder="Ej: 500000" min="0"></div>`,
    bodegaje: `<div class="input-group"><label>Bodegaje (COP)</label><input type="number" step="0.01" id="bodegaje" placeholder="Ej: 200000" min="0"></div>`,
    transporte: `<div class="input-group"><label>Transporte interno (COP)</label><input type="number" step="0.01" id="transporte" placeholder="Ej: 300000" min="0"></div>`
};

// ========== TRM ==========
async function cargarTRM() {
    try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
        const data = await res.json();
        const el = document.getElementById('trm');
        if (el) {
            el.value = data.rates.COP.toFixed(2);
            const st = document.getElementById('trm-status');
            if (st) st.textContent = `TRM cargada`;
        }
    } catch (error) {
        const el = document.getElementById('trm');
        if (el && !el.value) el.value = '4000.00';
    }
}

// ========== COLLAPSIBLE ==========
function initCollapsibleInfo() {
    const header = document.getElementById('infoHeader');
    const content = document.getElementById('infoContent');
    if (!header || !content) return;
    content.style.display = 'none';
    header.onclick = () => {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            header.querySelector('.info-arrow')?.classList.add('open');
        } else {
            content.style.display = 'none';
            header.querySelector('.info-arrow')?.classList.remove('open');
        }
    };
}

// ========== RENDER ==========
function renderModal(key) {
    const m = modalidades[key];
    if (!m) return;

    document.getElementById('modal-titulo').textContent = m.titulo;
    document.getElementById('modal-subtitulo').textContent = m.subtitulo;
    document.getElementById('modal-badge').textContent = m.badge;

    const infoBar = document.getElementById('modal-info-bar');
    infoBar.innerHTML = m.info;
    infoBar.classList.add('visible');
    
    if (key === 'ordinaria') setTimeout(initCollapsibleInfo, 50);

    const form = document.getElementById('calc-form');
    form.innerHTML = `<div class="form-section"><h3>📋 Datos</h3>${m.campos.map(c => camposHTML[c] || '').join('')}</div><button class="btn-calcular" id="btnCalcular">Calcular</button>`;

    document.getElementById('resultados').style.display = 'none';
    cargarTRM();

    const btn = document.getElementById('btnCalcular');
    if (btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => {
            const val = (id) => { const el = document.getElementById(id); return el ? toNumber(el.value) : 0; };
            const v = { fob: val('fob'), flete: val('flete'), seguro: val('seguro'), arancel: val('arancel'), trm: val('trm'), agencia: val('agencia'), bodegaje: val('bodegaje'), transporte: val('transporte') };
            if (v.fob === 0) { alert('Ingresa el valor FOB'); return; }
            if (v.trm === 0) { alert('Ingresa la TRM'); return; }
            const filas = m.calcular(v);
            document.getElementById('resultados-contenido').innerHTML = filas.map(f => `<div class="resultado-item ${f.clase || ''}"><span>${f.label}</span><span>${f.valor}</span></div>`).join('');
            document.getElementById('resultados').style.display = 'block';
            document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

// ========== NAVEGACIÓN ==========
function initNavigation() {
    const toggle = document.getElementById('importacion-toggle');
    if (toggle) toggle.onclick = () => {
        const submenu = document.getElementById('importacion-submenu');
        const arrow = toggle.querySelector('.arrow');
        if (submenu && arrow) {
            submenu.classList.toggle('open');
            arrow.classList.toggle('open');
        }
    };

    document.querySelectorAll('.nav-subitem').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-subitem').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderModal(item.dataset.modal);
        };
    });
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    const submenu = document.getElementById('importacion-submenu');
    const arrow = document.querySelector('.arrow');
    if (submenu && arrow) {
        submenu.classList.add('open');
        arrow.classList.add('open');
    }
    initNavigation();
    renderModal('ordinaria');
});