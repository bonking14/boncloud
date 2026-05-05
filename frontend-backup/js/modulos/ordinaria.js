// Importar funciones comunes
// (por ahora, solo copia y pega, luego aprendes a importar)

function calcularOrdinaria(datos) {
    const seguro = datos.seguro > 0 ? datos.seguro : datos.fob * 0.005;
    const cifUSD = datos.fob + datos.flete + seguro;
    const baseArancelariaCOP = cifUSD * datos.trm;
    const totalArancel = baseArancelariaCOP * (datos.arancel / 100);
    const baseIVA = baseArancelariaCOP + totalArancel;
    const totalIVA = baseIVA * 0.19;
    const gastos = datos.agencia + datos.bodegaje + datos.transporte;
    const totalPagar = totalArancel + totalIVA + gastos;

    return {
        cifUSD: cifUSD,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        totalArancel: Math.round(totalArancel),
        totalIVA: Math.round(totalIVA),
        totalPagar: Math.round(totalPagar)
    };
}