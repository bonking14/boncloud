// ========== FUNCIONES COMUNES ==========

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

function calcularSeguro(fob, seguroInput) {
    return seguroInput > 0 ? seguroInput : fob * 0.005;
}

// Si usas módulos (opcional, descomenta después)
// export { toNumber, redondear, formatUSD, formatCOP, calcularSeguro };