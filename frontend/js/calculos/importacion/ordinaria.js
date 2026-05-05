// ========== IMPORTACIÓN ORDINARIA (C100) ==========

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