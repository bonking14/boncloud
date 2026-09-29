// ========== EXPORTACIÓN - 3 MODALIDADES ==========

// ========== FUNCIONES COMUNES ==========
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

function redondear(valor) { return Math.round(valor); }

function formatUSD(valor) {
    return `USD ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCOP(valor) {
    return `COP ${redondear(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// ========== CÁLCULO COMÚN ==========
// En la exportación se declara el valor FOB. El flete y el seguro solo cuentan
// si la venta se pactó con un Incoterm que los incluye (CFR, CIF, CPT, CIP...).
// La exportación de bienes no paga arancel y está exenta de IVA (art. 481 E.T.).
function calcularExportacion(v) {
    const fleteSeguro = (v.flete || 0) + (v.seguro || 0);
    return {
        fob: v.fob,
        flete: v.flete || 0,
        seguro: v.seguro || 0,
        valorVenta: v.fob + fleteSeguro,
        incluyeFleteSeguro: fleteSeguro > 0,
        fobCOP: Math.round(v.fob * v.trm),
        trm: v.trm,
        meses: v.meses || 0
    };
}

function filasValor(r) {
    const filas = [{ label: 'Valor FOB declarado en la DEX', valor: formatUSD(r.fob), clase: 'destacado' }];
    if (r.incluyeFleteSeguro) {
        filas.push({ label: '+ Flete internacional (incluido en la venta)', valor: formatUSD(r.flete) });
        filas.push({ label: '+ Seguro internacional (incluido en la venta)', valor: formatUSD(r.seguro) });
        filas.push({ label: '= Valor total facturado según el Incoterm', valor: formatUSD(r.valorVenta) });
    }
    filas.push({ label: `Valor FOB en pesos (× TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.fobCOP) });
    return filas;
}

// ========== CONFIGURACIÓN DE MODALIDADES ==========
const modalidades = {
    definitiva: {
        titulo: 'Exportación Definitiva',
        badge: 'DEX 600',
        subtitulo: 'Salida de mercancías nacionales o nacionalizadas para uso o consumo definitivo en el exterior',
        info: '<strong>Cómo funciona:</strong> se presenta la solicitud de autorización de embarque, se embarca la mercancía y luego se presenta la declaración de exportación (DEX, formulario 600). Se declara el valor FOB. No se paga arancel y la venta está exenta de IVA, con derecho a devolución del IVA pagado en los insumos.',
        campos: ['fob', 'flete', 'seguro', 'trm'],
        calcular: (v) => {
            const r = calcularExportacion(v);
            return [
                ...filasValor(r),
                { label: 'Tributos aduaneros de exportación', valor: '$ 0 — no paga arancel; IVA exento', clase: 'exento' },
                { label: 'Documentos', valor: 'Solicitud de autorización de embarque, DEX (600), factura, documento de transporte, certificado de origen si el comprador pide preferencia, vistos buenos si aplica', clase: 'documento' }
            ];
        }
    },
    temporal: {
        titulo: 'Exportación Temporal',
        badge: 'DEX 600',
        subtitulo: 'Para reimportación en el mismo estado: ferias, exposiciones, reparación en el exterior',
        info: '<strong>Cómo funciona:</strong> la mercancía sale por un plazo determinado y debe regresar sin haber sufrido transformación. Al reimportarla dentro del plazo no paga tributos. Si no regresa a tiempo, la operación debe terminarse como exportación definitiva.',
        campos: ['fob', 'flete', 'seguro', 'trm', 'meses'],
        calcular: (v) => {
            const r = calcularExportacion(v);
            return [
                ...filasValor(r),
                { label: 'Plazo previsto de permanencia en el exterior', valor: r.meses ? `${r.meses} mes${r.meses === 1 ? '' : 'es'}` : 'Sin indicar' },
                { label: 'Tributos al salir y al reimportar en el mismo estado', valor: '$ 0', clase: 'exento' },
                { label: 'Documentos', valor: 'DEX temporal, factura proforma, documento de transporte, lista de empaque con seriales para identificar la mercancía al regreso', clase: 'documento' }
            ];
        }
    },
    menaje: {
        titulo: 'Exportación de Menaje',
        badge: 'DEX 600',
        subtitulo: 'Bienes del hogar de residentes que se trasladan a vivir al exterior',
        info: '<strong>Cómo funciona:</strong> los muebles y enseres usados del hogar salen con una declaración de exportación de menaje. No pagan tributos. Conviene llevar un inventario detallado con valores, porque es la base de la declaración.',
        campos: ['fob', 'flete', 'seguro', 'trm'],
        calcular: (v) => {
            const r = calcularExportacion(v);
            return [
                ...filasValor(r),
                { label: 'Tributos', valor: '$ 0 — exportación de menaje', clase: 'exento' },
                { label: 'Documentos', valor: 'DEX de menaje, inventario valorizado, documento de identidad, documento de transporte', clase: 'documento' }
            ];
        }
    }
};

// ========== CAMPOS HTML ==========
const camposHTML = {
    fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" step="0.01" id="fob" placeholder="Ej: 50000" min="0"></div>`,
    flete: `<div class="input-group"><label>Flete internacional (USD) <span class="hint">— solo si la venta lo incluye (CFR, CIF, CPT, CIP)</span></label><input type="number" step="0.01" id="flete" placeholder="0" min="0"></div>`,
    seguro: `<div class="input-group"><label>Seguro internacional (USD) <span class="hint">— solo si la venta lo incluye (CIF, CIP)</span></label><input type="number" step="0.01" id="seguro" placeholder="0" min="0"></div>`,
    trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" step="0.01" id="trm" placeholder="Ej: 4000"><span class="trm-status" id="trm-status"></span></div>`,
    meses: `<div class="input-group"><label>Plazo previsto en el exterior (meses)</label><input type="number" id="meses" placeholder="Ej: 6" min="1"></div>`
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
    } catch (error) {
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
    infoBar.classList.add('visible');

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
            const v = { 
                fob: val('fob'), 
                flete: val('flete'), 
                seguro: val('seguro'), 
                trm: val('trm'),
                meses: val('meses')
            };
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