// ========== EXPORTACIÓN MODAL - SOLO 3 MODALIDADES ==========

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

// ========== 1. EXPORTACIÓN DEFINITIVA ==========
function calcularExportacionDefinitiva(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const fobUSD = v.fob;
    const cifUSD = v.fob + v.flete + seguro;
    const fobCOP = fobUSD * v.trm;
    const cifCOP = cifUSD * v.trm;
    
    return {
        fob: fobUSD,
        flete: v.flete,
        seguro: seguro,
        cifUSD: cifUSD,
        fobCOP: Math.round(fobCOP),
        cifCOP: Math.round(cifCOP),
        trm: v.trm
    };
}

// ========== 2. EXPORTACIÓN TEMPORAL ==========
function calcularExportacionTemporal(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const baseCOP = cifUSD * v.trm;
    const poliza = baseCOP * 0.015; // 1.5% del valor
    
    return {
        fob: v.fob,
        flete: v.flete,
        seguro: seguro,
        cifUSD: cifUSD,
        baseCOP: Math.round(baseCOP),
        poliza: Math.round(poliza),
        meses: v.meses || 6,
        trm: v.trm
    };
}

// ========== 3. MENAJE ==========
function calcularMenaje(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const totalCOP = cifUSD * v.trm;
    
    return {
        fob: v.fob,
        flete: v.flete,
        seguro: seguro,
        cifUSD: cifUSD,
        totalCOP: Math.round(totalCOP),
        trm: v.trm
    };
}

// ========== MODALIDADES (SOLO 3) ==========
const modalidades = {
    definitiva: {
        titulo: 'Exportación Definitiva',
        badge: 'EXP-DEF',
        subtitulo: 'Salida definitiva de mercancías nacionales o nacionalizadas',
        info: `<strong>📋 ¿Cuándo se usa?</strong> Exportación normal de productos colombianos al exterior. Incluye todos los Incoterms.`,
        campos: ['fob', 'flete', 'seguro', 'trm'],
        calcular: (v) => {
            const r = calcularExportacionDefinitiva(v);
            return [
                { label: 'Valor FOB (EXW + internos)', valor: formatUSD(r.fob) },
                { label: '+ Flete internacional', valor: formatUSD(r.flete) },
                { label: '+ Seguro internacional', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Valor FOB en COP', valor: formatCOP(r.fobCOP) },
                { label: 'Valor CIF en COP', valor: formatCOP(r.cifCOP) },
                { label: 'Documentos requeridos', valor: 'DEX, Factura comercial, BL/AWB', clase: 'documento' }
            ];
        }
    },
    
    temporal: {
        titulo: 'Exportación Temporal',
        badge: 'EXP-TEMP',
        subtitulo: 'Para ferias, exposiciones, eventos — hasta 6 meses',
        info: `<strong>📋 ¿Cuándo se usa?</strong> Mercancías que salen temporalmente y regresan en el mismo estado. Se requiere póliza de garantía del 1.5%.`,
        campos: ['fob', 'flete', 'seguro', 'trm', 'meses'],
        calcular: (v) => {
            const r = calcularExportacionTemporal(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Base COP', valor: formatCOP(r.baseCOP) },
                { label: `Póliza garantía (1.5% por ${r.meses} meses)`, valor: formatCOP(r.poliza) },
                { label: 'Documentos', valor: 'DEX temporal, Póliza, Lista de empaque', clase: 'documento' }
            ];
        }
    },
    
    menaje: {
        titulo: 'Exportación Menaje',
        badge: 'EXP-MEN',
        subtitulo: 'Residentes que se trasladan definitivamente al exterior',
        info: `<strong>📋 ¿Cuándo se usa?</strong> Para colombianos que se van a vivir al exterior. Exento de tributos. Plazo: 30 días antes o 120 días después del viaje.`,
        campos: ['fob', 'flete', 'seguro', 'trm'],
        calcular: (v) => {
            const r = calcularMenaje(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Total COP', valor: formatCOP(r.totalCOP) },
                { label: 'Tributos', valor: '$ 0 — EXENTO por menaje', clase: 'exento' },
                { label: 'Documentos', valor: 'Formulario 530, Pasaporte, Prueba residencia', clase: 'documento' }
            ];
        }
    }
};

// ========== CAMPOS HTML ==========
const camposHTML = {
    fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" step="0.01" id="fob" placeholder="Ej: 50000" min="0"></div>`,
    flete: `<div class="input-group"><label>Flete internacional (USD)</label><input type="number" step="0.01" id="flete" placeholder="Ej: 3000" min="0"></div>`,
    seguro: `<div class="input-group"><label>Seguro (USD) <span class="hint">— 0 = 0.5% del FOB</span></label><input type="number" step="0.01" id="seguro" placeholder="0" min="0"></div>`,
    trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" step="0.01" id="trm" placeholder="Ej: 4000"><span class="trm-status" id="trm-status"></span></div>`,
    meses: `<div class="input-group"><label>Meses de permanencia</label><input type="number" id="meses" placeholder="Ej: 6" min="1" max="12"></div>`
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
            if (st) st.textContent = `✅ TRM cargada`;
        }
    } catch (error) {
        const el = document.getElementById('trm');
        if (el && !el.value) el.value = '4000.00';
    }
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

    const form = document.getElementById('calc-form');
    form.innerHTML = `<div class="form-section"><h3>📋 Datos</h3>${m.campos.map(c => camposHTML[c] || '').join('')}</div><button class="btn-calcular" id="btnCalcular">💰 Calcular</button>`;

    document.getElementById('resultados').style.display = 'none';
    cargarTRM();

    const btn = document.getElementById('btnCalcular');
    if (btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => {
            const val = (id) => { const el = document.getElementById(id); return el ? toNumber(el.value) : 0; };
            const v = { 
                fob: val('fob'), 
                flete: val('flete'), 
                seguro: val('seguro'), 
                trm: val('trm'),
                meses: val('meses')
            };
            if (v.fob === 0) { alert('⚠️ Ingresa el valor FOB'); return; }
            if (v.trm === 0) { alert('⚠️ Ingresa la TRM'); return; }
            const filas = m.calcular(v);
            document.getElementById('resultados-contenido').innerHTML = filas.map(f => `<div class="resultado-item ${f.clase || ''}"><span>${f.label}</span><span>${f.valor}</span></div>`).join('');
            document.getElementById('resultados').style.display = 'block';
            document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

// ========== NAVEGACIÓN ==========
function initNavigation() {
    const toggle = document.getElementById('exportacion-toggle');
    if (toggle) toggle.onclick = () => {
        const submenu = document.getElementById('exportacion-submenu');
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
    const submenu = document.getElementById('exportacion-submenu');
    const arrow = document.querySelector('.arrow');
    if (submenu && arrow) {
        submenu.classList.add('open');
        arrow.classList.add('open');
    }
    initNavigation();
    renderModal('definitiva');
});