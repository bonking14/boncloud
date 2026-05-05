// Funciones que usan TODAS las importaciones

function toNumber(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
}

function formatUSD(valor) {
    return 'USD ' + valor.toLocaleString('en-US', {minimumFractionDigits: 2});
}

function formatCOP(valor) {
    return 'COP ' + Math.round(valor).toLocaleString('es-CO');
}

function calcularSeguro(fob, seguroIngresado) {
    if (seguroIngresado > 0) return seguroIngresado;
    return fob * 0.005; // 0.5% del FOB
}