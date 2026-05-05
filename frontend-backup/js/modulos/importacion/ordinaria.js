// ========== IMPORTACIÓN ORDINARIA (C100) ==========

function calcularOrdinaria(datos) {
    // 1. Seguro (0.5% del FOB si no se especifica)
    const seguro = datos.seguro > 0 ? datos.seguro : datos.fob * 0.005;
    
    // 2. CIF USD
    const cifUSD = datos.fob + datos.flete + seguro;
    
    // 3. Base Arancelaria COP
    const baseArancelariaCOP = cifUSD * datos.trm;
    
    // 4. Total Arancel
    const totalArancel = baseArancelariaCOP * (datos.arancel / 100);
    
    // 5. Base IVA
    const baseIVA = baseArancelariaCOP + totalArancel;
    
    // 6. Total IVA
    const totalIVA = baseIVA * (datos.iva / 100);
    
    // 7. Total Impuestos
    const totalImpuestos = totalArancel + totalIVA;
    
    // 8. Gastos nacionalización
    const gastosNac = (datos.agencia || 0) + (datos.bodegaje || 0) + (datos.transporte || 0);
    
    // 9. Total a Pagar
    const totalPagar = totalImpuestos + gastosNac;
    
    return {
        fob: datos.fob,
        flete: datos.flete,
        seguro: seguro,
        cifUSD: cifUSD,
        arancelPorcentaje: datos.arancel,
        ivaPorcentaje: datos.iva,
        trm: datos.trm,
        baseArancelariaCOP: Math.round(baseArancelariaCOP),
        totalArancel: Math.round(totalArancel),
        baseIVA: Math.round(baseIVA),
        totalIVA: Math.round(totalIVA),
        totalImpuestos: Math.round(totalImpuestos),
        gastosNacionalizacion: Math.round(gastosNac),
        totalPagar: Math.round(totalPagar)
    };
}