// ========== IMPORTACIÓN - 3 MODALIDADES ==========

function toNumber(value) {
    // Acepta "60000", "60,000" (formato del campo), "60.000" (formato colombiano),
    // "4,100.50" y "4.100,50". Antes "60,000" se leía como 60.
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    let str = String(value).trim().replace(/[^0-9.,-]/g, '');
    const tieneComa = str.includes(',');
    const tienePunto = str.includes('.');
    if (tieneComa && tienePunto) {
        if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
            str = str.replace(/\./g, '').replace(',', '.');   // 4.100,50
        } else {
            str = str.replace(/,/g, '');                      // 4,100.50
        }
    } else if (tieneComa) {
        str = /^-?\d{1,3}(,\d{3})+$/.test(str)
            ? str.replace(/,/g, '')                           // 60,000
            : str.replace(',', '.');                          // 0,5
    } else if (tienePunto) {
        if (/^-?\d{1,3}(\.\d{3})+$/.test(str) && !/^-?0\./.test(str)) {
            str = str.replace(/\./g, '');                     // 60.000
        }
    }
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
// La DIAN aproxima cada tributo al múltiplo de mil más cercano
function aMiles(valor) {
    return Math.round(valor / 1000) * 1000;
}

function calcularOrdinaria(v) {
    const seguroSupuesto = !(v.seguro > 0);
    const seguro = seguroSupuesto ? v.fob * 0.005 : v.seguro;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const totalArancel = aMiles(baseArancelariaCOP * (v.arancel / 100));
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = aMiles(baseIVA * 0.19);
    const totalImpuestos = totalArancel + totalIVA;
    const gastosNac = (v.agencia || 0) + (v.bodegaje || 0) + (v.transporte || 0);
    const totalPagar = totalImpuestos + gastosNac;
    return { fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP), totalArancel: Math.round(totalArancel),
        baseIVA: Math.round(baseIVA), totalIVA: Math.round(totalIVA),
        totalImpuestos: Math.round(totalImpuestos), gastosNacionalizacion: Math.round(gastosNac),
        totalPagar: Math.round(totalPagar) };
}

// Franquicia total: la norma que la concede exonera arancel e IVA.
// Solo se pagan los gastos de nacionalización (no el valor de la mercancía).
function calcularFranquicia(v) {
    const seguroSupuesto = !(v.seguro > 0);
    const seguro = seguroSupuesto ? v.fob * 0.005 : v.seguro;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const gastos = (v.agencia || 0) + (v.bodegaje || 0) + (v.transporte || 0);
    return { fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        gastos: Math.round(gastos), totalPagar: Math.round(gastos), trm: v.trm };
}

// Temporal para reexportación en el mismo estado (corto plazo): los tributos
// se suspenden y se respaldan con una garantía. Lo que se paga es la prima de
// esa garantía (aquí un supuesto del 1,5% del valor garantizado) y los gastos.
const PRIMA_GARANTIA = 0.015;
function calcularTemporalCorto(v) {
    const seguroSupuesto = !(v.seguro > 0);
    const seguro = seguroSupuesto ? v.fob * 0.005 : v.seguro;
    const cifUSD = v.fob + v.flete + seguro;
    const baseArancelariaCOP = cifUSD * v.trm;
    const totalArancel = aMiles(baseArancelariaCOP * (v.arancel / 100));
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = aMiles(baseIVA * 0.19);
    const tributosSuspendidos = totalArancel + totalIVA;
    const poliza = tributosSuspendidos * PRIMA_GARANTIA;
    const gastos = (v.agencia || 0) + (v.bodegaje || 0) + (v.transporte || 0);
    return { fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP), tributosSuspendidos: Math.round(tributosSuspendidos),
        poliza: Math.round(poliza), gastos: Math.round(gastos),
        totalPagar: Math.round(gastos + poliza) };
}

// ========== MODALIDADES ==========
const modalidades = {
    ordinaria: {
        titulo: 'Importación Ordinaria',
        badge: 'C100',
        subtitulo: 'Mercancías para consumo definitivo en Colombia',
        info: 'Importación ordinaria: mercancías para consumo definitivo en Colombia. El arancel se liquida sobre el valor en aduana (CIF) y el IVA del 19% sobre el valor en aduana más el arancel. Cada tributo se aproxima al múltiplo de mil.',
        campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'bodegaje', 'transporte'],
        calcular: (v) => {
            const r = calcularOrdinaria(v);
            return [
                { label: '1. Valor FOB', valor: formatUSD(r.fob) },
                { label: '2. + Flete', valor: formatUSD(r.flete) },
                { label: r.seguroSupuesto ? '3. + Seguro (supuesto: 0,5% del FOB, no se escribió la prima real)' : '3. + Seguro', valor: formatUSD(r.seguro) },
                { label: '4. = Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: `5. Valor en aduana en pesos (× TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.baseArancelariaCOP) },
                { label: `6. + Arancel (${r.arancelPorcentaje}%, aproximado a miles)`, valor: formatCOP(r.totalArancel) },
                { label: '7. = Base del IVA', valor: formatCOP(r.baseIVA), clase: 'destacado' },
                { label: '8. + IVA (19%, aproximado a miles)', valor: formatCOP(r.totalIVA) },
                { label: '9. = Total Impuestos', valor: formatCOP(r.totalImpuestos), clase: 'destacado' },
                { label: '10. + Gastos nacionalización', valor: formatCOP(r.gastosNacionalizacion) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },
    franquicia: {
        titulo: 'Importación con Franquicia',
        badge: 'C110',
        subtitulo: 'Exención de tributos concedida por una norma o tratado',
        info: 'Importación con franquicia: modalidad para mercancías que, por una ley o un tratado, están exentas total o parcialmente de tributos. Este cálculo supone una franquicia total (arancel e IVA en cero). Antes de usarla verifica qué norma la concede, su alcance y sus condiciones.',
        campos: ['fob', 'flete', 'seguro', 'trm', 'agencia', 'bodegaje', 'transporte'],
        calcular: (v) => {
            const r = calcularFranquicia(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: r.seguroSupuesto ? '+ Seguro (supuesto: 0,5% del FOB)' : '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Valor en aduana en pesos', valor: formatCOP(r.baseArancelariaCOP) },
                { label: 'Arancel', valor: '$ 0 — exonerado por la franquicia', clase: 'exento' },
                { label: 'IVA', valor: '$ 0 — exonerado por la franquicia', clase: 'exento' },
                { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR (gastos)', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },
    'temporal-corto': {
        titulo: 'Importación Temporal Corto Plazo',
        badge: 'C150',
        subtitulo: 'Reexportación en el mismo estado — tributos suspendidos con garantía',
        info: 'Importación temporal de corto plazo: para ferias, exposiciones, eventos o equipos que vuelven a salir sin transformarse. Los tributos no se pagan sino que se suspenden y se respaldan con una garantía ante la DIAN. El costo de la póliza lo fija la aseguradora: aquí se usa un supuesto del 1,5% de los tributos garantizados. Si la mercancía no se reexporta a tiempo, se deben pagar los tributos.',
        campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'bodegaje', 'transporte'],
        calcular: (v) => {
            const r = calcularTemporalCorto(v);
            return [
                { label: 'Valor FOB', valor: formatUSD(r.fob) },
                { label: '+ Flete', valor: formatUSD(r.flete) },
                { label: r.seguroSupuesto ? '+ Seguro (supuesto: 0,5% del FOB)' : '+ Seguro', valor: formatUSD(r.seguro) },
                { label: '= Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: 'Valor en aduana en pesos', valor: formatCOP(r.baseArancelariaCOP) },
                { label: `Tributos suspendidos (arancel ${r.arancelPorcentaje}% + IVA 19%)`, valor: formatCOP(r.tributosSuspendidos), clase: 'suspendido' },
                { label: 'Prima de la garantía (supuesto: 1,5%)', valor: formatCOP(r.poliza) },
                { label: '+ Gastos', valor: formatCOP(r.gastos) },
                { label: 'TOTAL A PAGAR (prima + gastos)', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    }
};

// ========== CAMPOS HTML ==========
const camposHTML = {
    fob:       `<div class="form-field"><label>Valor FOB (USD)</label><input type="text" class="format-num" id="fob" placeholder="Ej: 125,000"></div>`,
    flete:     `<div class="form-field"><label>Flete internacional (USD) <i class="ph ph-info tooltip" title="Costo del transporte desde el país de origen al de destino"></i></label><input type="text" class="format-num" id="flete" placeholder="Ej: 7,500"></div>`,
    seguro:    `<div class="form-field"><label>Seguro (USD) <i class="ph ph-info tooltip" title="Escribe la prima real de la póliza. Si lo dejas vacío se usa un supuesto del 0,5% del FOB"></i></label><input type="text" class="format-num" id="seguro" placeholder="0"></div>`,
    arancel:   `<div class="form-field"><label>Arancel (%) <i class="ph ph-info tooltip" title="Porcentaje aplicable según la subpartida arancelaria"></i></label><input type="text" class="format-num" id="arancel" placeholder="Según la subpartida (ej: 5)"></div>`,
    trm:       `<div class="form-field"><label>TRM (COP por USD) <i class="ph ph-info tooltip" title="Para declarar se usa la TRM vigente el último día hábil de la semana anterior a la presentación de la declaración"></i></label><input type="text" class="format-num" id="trm" placeholder="Cargando..."><span class="field-hint" id="trm-status"></span></div>`,
    agencia:   `<div class="form-field"><label>Agencia aduanera (COP) <i class="ph ph-info tooltip" title="Honorarios de la agencia de aduanas, si la contratas"></i></label><input type="text" class="format-num" id="agencia" placeholder="Ej: 500,000"></div>`,
    bodegaje:  `<div class="form-field"><label>Bodegaje (COP)</label><input type="text" class="format-num" id="bodegaje" placeholder="Ej: 200,000"></div>`,
    transporte:`<div class="form-field"><label>Transporte interno (COP)</label><input type="text" class="format-num" id="transporte" placeholder="Ej: 300,000"></div>`
};

// ========== TRM ==========
async function cargarTRM() {
    try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
        const data = await res.json();
        const el = document.getElementById('trm');
        if (el && !el.value && data && data.rates && data.rates.COP) {
            el.value = data.rates.COP.toFixed(2);
            const st = document.getElementById('trm-status');
            if (st) st.textContent = 'Tasa de referencia de mercado (no es la TRM oficial). Para declarar usa la TRM del último día hábil de la semana anterior.';
        } else if (el && !el.value) {
            throw new Error('La respuesta no trae COP');
        }
    } catch {
        const el = document.getElementById('trm');
        if (el && !el.value) el.value = '4000.00';
        const st = document.getElementById('trm-status');
        if (st) st.textContent = 'No se pudo cargar una tasa de referencia: escribe la TRM oficial.';
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
        const campoArancel = document.getElementById('arancel');
        if (campoArancel && campoArancel.value.trim() === '') { alert('Escribe el arancel de la subpartida (puede ser 0)'); return; }

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
    precargarDesdeURL();
});

// ========== PRECARGA DESDE LA RUTA DE APRENDIZAJE ==========
// El curso abre esta página con ?fob=...&flete=...&seguro=...&trm=...&arancel=...
function precargarDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const campos = ['fob', 'flete', 'seguro', 'trm', 'arancel'];
    let alguno = false;
    campos.forEach(id => {
        const valor = params.get(id);
        const el = document.getElementById(id);
        if (valor !== null && el && !isNaN(Number(valor))) {
            el.value = Number(valor).toLocaleString('en-US', { maximumFractionDigits: 2 });
            alguno = true;
        }
    });
    if (alguno) {
        const st = document.getElementById('trm-status');
        if (st && params.get('trm')) st.textContent = 'Valor del caso de práctica de la Ruta de Aprendizaje';
        const info = document.getElementById('modal-info-bar');
        if (info) info.insertAdjacentHTML('beforeend', '<br><strong>Datos precargados desde la Ruta de Aprendizaje.</strong> Pulsa «Calcular declaración» para ver la liquidación del caso.');
    }
}

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

// ========== COMPARADOR LADO A LADO ==========
function ejecutarComparativaModalidades() {
    const getV = (id, def = 0) => {
        const el = document.getElementById(id);
        return el ? toNumber(el.value) : def;
    };

    const v = {
        fob: getV('fob', 15000),
        flete: getV('flete', 2500),
        seguro: getV('seguro', 0),
        arancel: getV('arancel', 10),
        trm: getV('trm', 4200),
        agencia: getV('agencia', 1200000),
        bodegaje: getV('bodegaje', 600000),
        transporte: getV('transporte', 800000)
    };

    const resOrd = calcularOrdinaria(v);
    const resFran = calcularFranquicia(v);
    const resTemp = calcularTemporalCorto(v);

    const tbody = document.getElementById('comparador-body');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td style="padding:10px; font-weight:600;">1. Valor CIF (USD)</td>
            <td style="padding:10px; text-align:right;">${formatUSD(resOrd.cifUSD)}</td>
            <td style="padding:10px; text-align:right;">${formatUSD(resFran.cifUSD)}</td>
            <td style="padding:10px; text-align:right;">${formatUSD(resTemp.cifUSD)}</td>
        </tr>
        <tr>
            <td style="padding:10px; font-weight:600;">2. Base Gravable (COP)</td>
            <td style="padding:10px; text-align:right;">${formatCOP(resOrd.baseArancelariaCOP)}</td>
            <td style="padding:10px; text-align:right;">${formatCOP(resFran.baseArancelariaCOP)}</td>
            <td style="padding:10px; text-align:right;">${formatCOP(resTemp.baseArancelariaCOP)}</td>
        </tr>
        <tr>
            <td style="padding:10px; font-weight:600;">3. Arancel Ad-Valorem</td>
            <td style="padding:10px; text-align:right; color:#f87171;">${formatCOP(resOrd.totalArancel)}</td>
            <td style="padding:10px; text-align:right; color:#4ade80;">EXENTO (0%)</td>
            <td style="padding:10px; text-align:right; color:#f59e0b;">SUSPENDIDO</td>
        </tr>
        <tr>
            <td style="padding:10px; font-weight:600;">4. IVA (19%)</td>
            <td style="padding:10px; text-align:right; color:#f87171;">${formatCOP(resOrd.totalIVA)}</td>
            <td style="padding:10px; text-align:right; color:#4ade80;">EXENTO (0%)</td>
            <td style="padding:10px; text-align:right; color:#f59e0b;">SUSPENDIDO</td>
        </tr>
        <tr>
            <td style="padding:10px; font-weight:600;">5. Póliza / Garantía Aduanera</td>
            <td style="padding:10px; text-align:right; color:var(--text-muted);">N/A</td>
            <td style="padding:10px; text-align:right; color:var(--text-muted);">N/A</td>
            <td style="padding:10px; text-align:right; color:#f59e0b;">${formatCOP(resTemp.poliza)}</td>
        </tr>
        <tr style="background:var(--bg-card); font-weight:bold; border-top:2px solid var(--border);">
            <td style="padding:12px; font-size:1rem; color:var(--text-primary);">TOTAL A PAGAR (COP)</td>
            <td style="padding:12px; text-align:right; color:#60a5fa; font-size:1rem;">${formatCOP(resOrd.totalPagar)}</td>
            <td style="padding:12px; text-align:right; color:#4ade80; font-size:1rem;">${formatCOP(resFran.totalPagar)}</td>
            <td style="padding:12px; text-align:right; color:#f59e0b; font-size:1rem;">${formatCOP(resTemp.totalPagar)}</td>
        </tr>
    `;
}