// ========== IMPORTACIÓN CON FRANQUICIA (C110) ==========
// Decreto 1165/2019 · Resolución DIAN 046/2019 · Puerto de Cartagena

const FRANQUICIA_TIPOS = {
  viajero: {
    label: 'Viajero internacional',
    limiteUSD: 200,
    arancelExcedente: 0.15,
    iva: 0.19,
    legal: 'Art. 140 Decreto 1165/2019'
  },
  diplomatico: {
    label: 'Misión diplomática / consular',
    limiteUSD: Infinity,
    arancelExcedente: 0,
    iva: 0,
    legal: 'Art. 141 Decreto 1165/2019 · Convención de Viena 1961'
  },
  menaje: {
    label: 'Menaje de casa',
    limiteUSD: Infinity,
    arancelExcedente: 0,
    iva: 0,
    legal: 'Art. 142 Decreto 1165/2019'
  },
  zonaFranca: {
    label: 'Zona Franca Cartagena',
    limiteUSD: Infinity,
    arancelExcedente: 0,
    iva: 0,
    legal: 'Art. 394-410 Decreto 1165/2019 · Ley 1004/2005'
  }
};

function calcularFranquicia(v) {
  // v.tipo: 'viajero' | 'diplomatico' | 'menaje' | 'zonaFranca'
  // v.fob (USD), v.flete (USD), v.seguro (USD, 0=auto),
  // v.trm (COP/USD), v.agencia (COP), v.bodegaje (COP)

  const tipo = FRANQUICIA_TIPOS[v.tipo] || FRANQUICIA_TIPOS.viajero;

  // 1. Seguro: si no se ingresa, se calcula al 0.5% del FOB (estándar DIAN Cartagena)
  const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
  const seguroAuto = v.seguro === 0;

  // 2. Valor CIF = FOB + Flete + Seguro (base arancelaria oficial)
  const cifUSD = v.fob + v.flete + seguro;
  const cifCOP = cifUSD * v.trm;

  // 3. Determinar si aplica franquicia total o parcial
  const dentroLimite = v.fob <= tipo.limiteUSD;
  const excedenteUSD = dentroLimite ? 0 : v.fob - tipo.limiteUSD;
  const excedenteCOP = excedenteUSD * v.trm;

  // 4. Liquidación arancelaria
  // Dentro del límite: arancel = 0, IVA = 0 (exención total por franquicia)
  // Excedente viajero: arancel 15% + IVA 19% sobre (base excedente + arancel)
  const baseExcedenteCOP = excedenteCOP;
  const arancelExcedente = Math.round(baseExcedenteCOP * tipo.arancelExcedente);
  const ivaExcedente = Math.round((baseExcedenteCOP + arancelExcedente) * tipo.iva);
  const totalTributos = arancelExcedente + ivaExcedente;

  // 5. Gastos logísticos Cartagena (no hacen parte de la base arancelaria)
  const agencia  = Math.round(v.agencia  || 0); // agencia aduanera / OTM
  const bodegaje = Math.round(v.bodegaje || 0); // Contecar / Manga

  // 6. Total a pagar
  const totalPagar = Math.round(totalTributos + agencia + bodegaje);

  return {
    // Inputs procesados
    tipo:           tipo.label,
    legal:          tipo.legal,
    fob:            v.fob,
    flete:          v.flete,
    seguro:         seguro,
    seguroAuto:     seguroAuto,
    trm:            v.trm,

    // CIF
    cifUSD:             Math.round(cifUSD * 100) / 100,
    cifCOP:             Math.round(cifCOP),

    // Franquicia
    dentroLimite:       dentroLimite,
    limiteUSD:          tipo.limiteUSD,
    excedenteUSD:       Math.round(excedenteUSD * 100) / 100,

    // Tributos
    arancelExcedente:   arancelExcedente,
    ivaExcedente:       ivaExcedente,
    totalTributos:      totalTributos,

    // Gastos logísticos
    agencia:            agencia,
    bodegaje:           bodegaje,

    // Total
    totalPagar:         totalPagar
  };
}

function franquiciaResultados(r) {
  const filas = [
    { label: 'Valor FOB',              valor: formatUSD(r.fob) },
    { label: '+ Flete internacional',  valor: formatUSD(r.flete) },
    {
      label: `+ Seguro${r.seguroAuto ? ' (auto 0.5% FOB)' : ''}`,
      valor: formatUSD(r.seguro)
    },
    {
      label: '= Valor CIF (base arancelaria)',
      valor: `${formatUSD(r.cifUSD)} / ${formatCOP(r.cifCOP)}`,
      clase: 'destacado'
    }
  ];

  if (r.dentroLimite || r.limiteUSD === Infinity) {
    // Franquicia total — todo exento
    filas.push(
      { label: 'Gravamen arancelario', valor: '$ 0 — EXENTO (franquicia)', clase: 'exento' },
      { label: 'IVA importación',      valor: '$ 0 — EXENTO (franquicia)', clase: 'exento' }
    );
  } else {
    // Franquicia parcial — excedente tributa
    filas.push(
      { label: `Excedente sobre límite USD ${r.limiteUSD}`, valor: formatUSD(r.excedenteUSD), clase: 'alerta' },
      { label: 'Arancel 15% sobre excedente', valor: formatCOP(r.arancelExcedente), clase: 'tributo' },
      { label: 'IVA 19% sobre (excedente + arancel)', valor: formatCOP(r.ivaExcedente), clase: 'tributo' },
      { label: 'Total tributos excedente', valor: formatCOP(r.totalTributos), clase: 'subtotal' }
    );
  }

  filas.push(
    { label: '+ Agencia aduanera / OTM', valor: formatCOP(r.agencia) },
    { label: '+ Bodegaje Contecar / Manga', valor: formatCOP(r.bodegaje) },
    { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' },
    { label: 'Base legal', valor: r.legal, clase: 'legal' }
  );

  return filas;
}