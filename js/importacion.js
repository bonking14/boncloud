// ========== IMPORTACIÓN - 3 MODALIDADES ==========

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

function formatUSD(valor) {
    return `USD ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCOP(valor) {
    return `COP ${Math.round(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// ========== CÁLCULOS ==========
function calcularOrdinaria(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const totalArancel = baseArancelariaCOP * (v.arancel / 100);
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = baseIVA * 0.19;
    const totalImpuestos = totalArancel + totalIVA;
    const gastosNac = (v.agencia || 0) + (v.bodegaje || 0) + (v.transporte || 0);
    const totalPagar = totalImpuestos + gastosNac;
    return { fob: v.fob, flete: v.flete, seguro, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP), totalArancel: Math.round(totalArancel),
        baseIVA: Math.round(baseIVA), totalIVA: Math.round(totalIVA),
        totalImpuestos: Math.round(totalImpuestos), gastosNacionalizacion: Math.round(gastosNac),
        totalPagar: Math.round(totalPagar) };
}

function calcularFranquicia(v) {
    const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const gastos = (v.agencia || 0) + (v.bodegaje || 0);
    return { fob: v.fob, flete: v.flete, seguro, cifUSD,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        gastos: Math.round(gastos), totalPagar: Math.round(baseArancelariaCOP + gastos), trm: v.trm };
}

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
    return { fob: v.fob, flete: v.flete, seguro, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP), tributosSuspendidos: Math.round(tributosSuspendidos),
        poliza: Math.round(poliza), gastos: Math.round(gastos),
        totalPagar: Math.round(baseArancelariaCOP + gastos + poliza) };
}

// ========== MODALIDADES ==========
const modalidades = {
    ordinaria: {
        titulo: 'Importación Ordinaria',
        badge: 'C100',
        subtitulo: 'Mercancías para consumo definitivo en Colombia',
        info: 'Importación Ordinaria — Declaración de mercancías para consumo definitivo en Colombia. Aplica arancel + IVA (19%) sobre base arancelaria CIF.',
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
        info: 'Franquicia — Exenta de arancel e IVA. Aplica a viajeros internacionales con cupo libre hasta USD 200 según Decreto 1165 de 2019.',
        campos: ['fob', 'flete', 'seguro', 'trm', 'agencia', 'bodegaje'],
        calcular: (v) => {
            const r = calcularFranquicia(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Base Arancelaria COP', valor: formatCOP(r.baseArancelariaCOP) },
                { label: 'Arancel', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: 'IVA', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },
    'temporal-corto': {
        titulo: 'Importación Temporal Corto Plazo',
        badge: 'C150',
        subtitulo: 'Hasta 6 meses — tributos suspendidos + póliza 1.5%',
        info: 'Temporal Corto Plazo — Para ferias, exposiciones y eventos. Los tributos se suspenden y se paga una póliza de garantía del 1.5%.',
        campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'bodegaje'],
        calcular: (v) => {
            const r = calcularTemporalCorto(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor CIF USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Base Arancelaria COP', valor: formatCOP(r.baseArancelariaCOP) },
                { label: `Tributos suspendidos (Arancel ${r.arancelPorcentaje}% + IVA)`, valor: formatCOP(r.tributosSuspendidos), clase: 'suspendido' },
                { label: 'Póliza de garantía (1.5%)', valor: formatCOP(r.poliza) },
                { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    }
};

// ========== CAMPOS HTML ==========
const camposHTML = {
    fob:       `<div class="form-field"><label>Valor FOB (USD)</label><input type="text" class="format-num" id="fob" placeholder="Ej: 125,000"></div>`,
    flete:     `<div class="form-field"><label>Flete internacional (USD) <i class="ph ph-info tooltip" title="Costo del transporte desde el país de origen al de destino"></i></label><input type="text" class="format-num" id="flete" placeholder="Ej: 7,500"></div>`,
    seguro:    `<div class="form-field"><label>Seguro (USD) <i class="ph ph-info tooltip" title="Dejar en 0 = se calcula automático (0.5% del FOB)"></i></label><input type="text" class="format-num" id="seguro" placeholder="0"></div>`,
    arancel:   `<div class="form-field"><label>Arancel (%) <i class="ph ph-info tooltip" title="Porcentaje aplicable según la subpartida arancelaria"></i></label><input type="text" class="format-num" id="arancel" placeholder="15" value="15"></div>`,
    trm:       `<div class="form-field"><label>TRM (COP por USD) <i class="ph ph-info tooltip" title="Tasa de Cambio Representativa del Mercado"></i></label><input type="text" class="format-num" id="trm" placeholder="Cargando..."><span class="field-hint" id="trm-status"></span></div>`,
    agencia:   `<div class="form-field"><label>Agencia aduanera (COP) <i class="ph ph-info tooltip" title="Honorarios cobrados por la SIA"></i></label><input type="text" class="format-num" id="agencia" placeholder="Ej: 500,000"></div>`,
    bodegaje:  `<div class="form-field"><label>Bodegaje (COP)</label><input type="text" class="format-num" id="bodegaje" placeholder="Ej: 200,000"></div>`,
    transporte:`<div class="form-field"><label>Transporte interno (COP)</label><input type="text" class="format-num" id="transporte" placeholder="Ej: 300,000"></div>`
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
            if (st) st.textContent = 'TRM cargada automáticamente';
        }
    } catch {
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

    const baseFields = ['fob', 'flete', 'seguro'];
    const localFields = ['arancel', 'trm', 'agencia', 'bodegaje', 'transporte'];

    const col1 = m.campos.filter(c => baseFields.includes(c)).map(c => camposHTML[c] || '').join('');
    const col2 = m.campos.filter(c => localFields.includes(c)).map(c => camposHTML[c] || '').join('');

    const form = document.getElementById('calc-form');
    form.innerHTML = `
        <div class="form-layout">
            <div class="form-col">
                <h4 class="col-title">Valores Base</h4>
                <div class="col-content">${col1}</div>
            </div>
            <div class="form-col">
                <h4 class="col-title">Tasas y Gastos Locales</h4>
                <div class="col-content">${col2}</div>
            </div>
        </div>
        <button class="btn-calcular btn-cta" id="btnCalcular">Calcular Declaración</button>
    `;

    document.getElementById('resultados').style.display = 'none';
    cargarTRM();

    document.getElementById('btnCalcular').onclick = () => {
        const val = (id) => { const el = document.getElementById(id); return el ? toNumber(el.value) : 0; };
        const v = {
            fob: val('fob'), flete: val('flete'), seguro: val('seguro'),
            arancel: val('arancel'), trm: val('trm'),
            agencia: val('agencia'), bodegaje: val('bodegaje'), transporte: val('transporte')
        };
        if (v.fob === 0) { alert('Ingresa el valor FOB'); return; }
        if (v.trm === 0) { alert('Ingresa la TRM'); return; }

        const filas = m.calcular(v);
        document.getElementById('resultados-contenido').innerHTML = filas.map(f =>
            `<div class="resultado-row ${f.clase || ''}">
                <span class="label">${f.label}</span>
                <span class="valor">${f.valor}</span>
            </div>`
        ).join('');
        document.getElementById('resultados').style.display = 'block';
        document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
    };
}

// ========== NAVEGACIÓN ==========
function initNavigation() {
    const toggle = document.getElementById('importacion-toggle');
    if (toggle) {
        toggle.onclick = () => {
            const submenu = document.getElementById('importacion-submenu');
            if (submenu) {
                const isOpen = submenu.classList.toggle('open');
                toggle.classList.toggle('open', isOpen);
            }
        };
    }

    document.querySelectorAll('.nav-subitem').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-subitem').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderModal(item.dataset.modal);
        };
    });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    const submenu = document.getElementById('importacion-submenu');
    const toggle = document.getElementById('importacion-toggle');
    if (submenu && toggle) {
        submenu.classList.add('open');
        toggle.classList.add('open');
    }
    initNavigation();
    renderModal('ordinaria');
});

// ========== FORMATO DE ENTRADA ==========
document.addEventListener('input', e => {
    if (e.target.classList.contains('format-num')) {
        let raw = e.target.value.replace(/[^0-9.]/g, '');
        if (raw) {
            let parts = raw.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            e.target.value = parts.join('.');
        }
    }
});

document.addEventListener('blur', e => {
    if (e.target.classList.contains('format-num')) {
        let val = toNumber(e.target.value);
        if (val > 0 || e.target.id === 'seguro' || e.target.id === 'arancel') {
            e.target.style.borderColor = '#22c55e';
            e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.1)';
        } else {
            e.target.style.borderColor = '#ef4444';
            e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.1)';
        }
    }
}, true);