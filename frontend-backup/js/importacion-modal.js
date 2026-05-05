// ========== IMPORTACIÓN MODAL - VERSIÓN MODULAR ==========
// Las funciones están separadas por modalidad, pero siguen funcionando igual

// ========== FUNCIONES COMUNES (copiadas de core.js) ==========
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

function redondear(valor) {
    return Math.round(valor);
}

function formatUSD(valor) {
    return `USD ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCOP(valor) {
    return `COP ${redondear(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// ========== CÁLCULO ORDINARIA ==========
function calcularOrdinaria(datos) {
    const seguro = datos.seguro > 0 ? datos.seguro : datos.fob * 0.005;
    const cifUSD = datos.fob + datos.flete + seguro;
    const baseArancelariaCOP = cifUSD * datos.trm;
    const totalArancel = baseArancelariaCOP * (datos.arancel / 100);
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = baseIVA * (datos.iva / 100);
    const totalImpuestos = totalArancel + totalIVA;
    const gastosNac = (datos.agencia || 0) + (datos.bodegaje || 0) + (datos.transporte || 0);
    const totalPagar = totalImpuestos + gastosNac;

    return {
        fob: datos.fob, flete: datos.flete, seguro, cifUSD,
        arancelPorcentaje: datos.arancel, ivaPorcentaje: datos.iva, trm: datos.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        totalArancel: Math.round(totalArancel),
        baseIVA: Math.round(baseIVA),
        totalIVA: Math.round(totalIVA),
        totalImpuestos: Math.round(totalImpuestos),
        gastosNacionalizacion: Math.round(gastosNac),
        totalPagar: Math.round(totalPagar)
    };
}
const modalidades = {
    ordinaria: {
        titulo: 'Importación Ordinaria',
        badge: 'C100',
        subtitulo: 'Declaración ordinaria — mercancías para consumo definitivo en Colombia',
        info: `<div class="info-collapsible"><div class="info-header" id="infoHeader"><span class="info-arrow">▶</span><strong>📋 Secuencia de cálculo</strong></div><div class="info-content" id="infoContent" style="display: none;"><ol><li>Valor FOB (USD)</li><li>+ Flete Internacional (USD)</li><li>+ Seguro Internacional (0.5% del FOB si no se especifica)</li><li><strong>= Valor CIF USD</strong> (Total Aduana en dólares)</li><li>× TRM = <strong>Base Arancelaria COP</strong></li><li>× %Arancel = <strong>Total Arancel</strong></li><li>Base Arancelaria + Arancel = <strong>Base IVA</strong></li><li>× 19% = <strong>Total IVA</strong></li><li>Arancel + IVA = <strong>Total Impuestos (Tributos Aduaneros)</strong></li><li>+ Gastos Nacionalización = <strong>TOTAL A PAGAR</strong></li></ol></div></div>`,
        campos: ['fob', 'flete', 'seguro', 'arancel', 'iva', 'trm', 'agencia', 'bodegaje', 'transporte'],
        calcular: (v) => {
            const r = calcularOrdinaria(v);
            return [
                { label: '1. Valor FOB', valor: formatUSD(r.fob) },
                { label: '2. + Flete Internacional', valor: formatUSD(r.flete) },
                { label: '3. + Seguro Internacional', valor: formatUSD(r.seguro) },
                { label: '4. = Valor CIF USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
                { label: '──────────────────', valor: '', clase: 'separador' },
                { label: `5. Base Arancelaria (CIF × TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.baseArancelariaCOP) },
                { label: `6. + Arancel (${r.arancelPorcentaje}%)`, valor: formatCOP(r.totalArancel) },
                { label: '7. = Base IVA', valor: formatCOP(r.baseIVA), clase: 'destacado' },
                { label: `8. + IVA (${r.ivaPorcentaje}%)`, valor: formatCOP(r.totalIVA) },
                { label: '9. = Total Impuestos (Tributos Aduaneros)', valor: formatCOP(r.totalImpuestos), clase: 'destacado' },
                { label: '──────────────────', valor: '', clase: 'separador' },
                { label: '10. + Gastos de nacionalización', valor: formatCOP(r.gastosNacionalizacion) },
                { label: '11. TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
            ];
        }
    },  // ← CIERRA ordinaria con COMA

    franquicia: {
        titulo: 'Importación con Franquicia',
        badge: 'C110',
        subtitulo: 'Exención total o parcial de tributos aduaneros',
        info: `<strong>📋 ¿Cuándo se usa?</strong> Cuando existe una norma legal que exime del pago de aranceles e IVA. Aplica a embajadas, organismos internacionales, donaciones, etc.`,
        campos: ['fob', 'flete', 'seguro', 'trm', 'agencia'],
        calcular: (v) => {
            const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
            const cifUSD = v.fob + v.flete + seguro;
            const baseArancelariaCOP = cifUSD * v.trm;
            const gastos = v.agencia || 0;
            const totalPagar = Math.round(baseArancelariaCOP + gastos);
            
            return [
                { label: 'Valor FOB', valor: formatUSD(v.fob) },
                { label: '+ Flete', valor: formatUSD(v.flete) },
                { label: '+ Seguro', valor: formatUSD(seguro) },
                { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
                { label: 'Arancel', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: 'IVA', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
            ];
        }
    },  // ← CIERRA franquicia (sin coma si es la última)

    reimportacion: {
        titulo: 'Reimportación en el mismo estado',
        badge: 'C160',
        subtitulo: 'Mercancías que regresan a Colombia sin transformación — exentas de tributos',
        info: `<strong>📋 ¿Cuándo se usa?</strong> Cuando mercancías colombianas que salieron temporalmente regresan sin modificación. Exenta de tributos si se acredita origen nacional.`,
        campos: ['fob', 'flete', 'seguro', 'trm', 'agencia'],
        calcular: (v) => {
            const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
            const cifUSD = v.fob + v.flete + seguro;
            const baseArancelariaCOP = cifUSD * v.trm;
            const gastos = v.agencia || 0;
            const totalPagar = Math.round(baseArancelariaCOP + gastos);
            
            return [
                { label: 'Valor FOB', valor: formatUSD(v.fob) },
                { label: '+ Flete', valor: formatUSD(v.flete) },
                { label: '+ Seguro', valor: formatUSD(seguro) },
                { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
                { label: 'Arancel', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: 'IVA', valor: '$ 0 — EXENTO', clase: 'exento' },
                { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
                { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
            ];
        }
    },  // ← CIERRA reimportacion (con coma porque vienen más)
    
    // Aquí puedes seguir agregando: garantia, temporal, etc.
    
};  // ← CIERRA modalidades
    

// ========== RESTO DEL CÓDIGO (camposHTML, cargarTRM, renderModal, etc.) ==========
// ... (copia el resto de tu archivo original aquí)

const camposHTML = {
    fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" step="0.01" id="fob" placeholder="Ej: 125000.00" min="0"></div>`,
    flete: `<div class="input-group"><label>Flete internacional (USD)</label><input type="number" step="0.01" id="flete" placeholder="Ej: 7500.00" min="0"></div>`,
    seguro: `<div class="input-group"><label>Seguro (USD) <span class="hint">— 0 = calcular 0.5% del FOB</span></label><input type="number" step="0.01" id="seguro" placeholder="0" min="0"></div>`,
    arancel: `<div class="input-group"><label>Arancel (%)</label><input type="number" step="0.01" id="arancel" placeholder="Ej: 15" min="0" max="100"></div>`,
    iva: `<div class="input-group"><label>IVA (%)</label><input type="number" step="0.01" id="iva" placeholder="19" value="19" min="0" max="100"></div>`,
    trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" step="0.01" id="trm" placeholder="Ej: 3660.10"><span class="trm-status" id="trm-status"></span></div>`,
    agencia: `<div class="input-group"><label>Agencia de aduanas (COP)</label><input type="number" step="0.01" id="agencia" placeholder="Ej: 500000" min="0"></div>`,
    bodegaje: `<div class="input-group"><label>Almacenamiento / bodegaje (COP)</label><input type="number" step="0.01" id="bodegaje" placeholder="Ej: 200000" min="0"></div>`,
    transporte: `<div class="input-group"><label>Transporte interno (COP)</label><input type="number" step="0.01" id="transporte" placeholder="Ej: 300000" min="0"></div>`
};

async function cargarTRM() {
    try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
        const data = await res.json();
        const el = document.getElementById('trm');
        if (el) {
            el.value = data.rates.COP.toFixed(2);
            const st = document.getElementById('trm-status');
            if (st) st.textContent = `✅ TRM cargada — ${new Date().toLocaleDateString('es-CO')}`;
        }
    } catch (error) {
        console.warn('Error cargando TRM:', error);
        const el = document.getElementById('trm');
        if (el && !el.value) {
            el.value = '4000.00';
            const st = document.getElementById('trm-status');
            if (st) st.textContent = `⚠️ Usando TRM por defecto (4,000)`;
        }
    }
}

function initCollapsibleInfo() {
    const header = document.getElementById('infoHeader');
    const content = document.getElementById('infoContent');
    if (!header || !content) return;
    content.style.display = 'none';
    header.addEventListener('click', () => {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            header.querySelector('.info-arrow')?.classList.add('open');
        } else {
            content.style.display = 'none';
            header.querySelector('.info-arrow')?.classList.remove('open');
        }
    });
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
    
    if (key === 'ordinaria') initCollapsibleInfo();

    const form = document.getElementById('calc-form');
    form.innerHTML = `<div class="form-section"><h3>📋 Datos de la operación</h3>${m.campos.map(c => camposHTML[c] || '').join('')}</div><button class="btn-calcular" id="btnCalcular">💰 Calcular</button>`;

    document.getElementById('resultados').style.display = 'none';
    cargarTRM();

    const btnCalcular = document.getElementById('btnCalcular');
    if (btnCalcular) {
        const newBtn = btnCalcular.cloneNode(true);
        btnCalcular.parentNode.replaceChild(newBtn, btnCalcular);
        newBtn.addEventListener('click', () => {
            const val = (id) => { const el = document.getElementById(id); return el ? toNumber(el.value) : 0; };
            const v = { fob: val('fob'), flete: val('flete'), seguro: val('seguro'), arancel: val('arancel'), iva: val('iva') || 19, trm: val('trm'), agencia: val('agencia'), bodegaje: val('bodegaje'), transporte: val('transporte') };
            if (v.fob === 0) { alert('⚠️ Ingresa el valor FOB.'); return; }
            if (v.trm === 0) { alert('⚠️ Ingresa la TRM.'); return; }
            const filas = m.calcular(v);
            document.getElementById('resultados-contenido').innerHTML = filas.map(f => `<div class="resultado-item ${f.clase || ''}"><span>${f.label}</span><span>${f.valor}</span></div>`).join('');
            document.getElementById('resultados').style.display = 'block';
            document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function initNavigation() {
    const toggle = document.getElementById('importacion-toggle');
    if (toggle) toggle.addEventListener('click', () => document.getElementById('importacion-submenu')?.classList.toggle('open'));
    document.querySelectorAll('.nav-subitem').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-subitem').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderModal(item.dataset.modal);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('importacion-submenu')?.classList.add('open');
    initNavigation();
    renderModal('ordinaria');
}); 