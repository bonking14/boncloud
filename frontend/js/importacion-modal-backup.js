// ========== FUNCIONES DE UTILIDAD ==========

/**
 * Convierte un string a número respetando decimales
 * Ej: "3660.10" → 3660.10
 * Ej: "3.660,10" → 3660.10
 */
function toNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    
    let str = String(value).trim();
    
    // Detecta formato europeo: puntos como miles y coma como decimal (ej: 3.660,10)
    if (str.includes(',') && str.includes('.')) {
        const lastDot = str.lastIndexOf('.');
        const lastComma = str.lastIndexOf(',');
        if (lastComma > lastDot) {
            // Formato europeo: quitar puntos de miles, cambiar coma por punto
            str = str.replace(/\./g, '');
            str = str.replace(',', '.');
        } else {
            // Formato inglés: quitar comas de miles
            str = str.replace(/,/g, '');
        }
    } else if (str.includes(',') && !str.includes('.')) {
        // Solo comas: puede ser decimal (cambiar coma por punto)
        str = str.replace(',', '.');
    } else if (str.includes('.') && (str.match(/\./g) || []).length > 1) {
        // Múltiples puntos: son separadores de miles, eliminarlos
        str = str.replace(/\./g, '');
    }
    
    // Eliminar cualquier otro carácter no numérico excepto punto
    str = str.replace(/[^0-9.-]/g, '');
    
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
}

/**
 * Redondeo financiero (al entero más cercano)
 */
function redondear(valor) {
    return Math.round(valor);
}

/**
 * Formatea moneda USD (2 decimales)
 */
function formatUSD(valor) {
    return `USD ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formatea moneda COP (sin decimales)
 */
function formatCOP(valor) {
    return `COP ${redondear(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// ========== LÓGICA DE CÁLCULO CORREGIDA (PASO A PASO) ==========

/**
 * Calcula la importación ordinaria siguiendo la secuencia:
 * 1. Valor FOB
 * 2. + Flete Internacional
 * 3. + Seguro Internacional (0.5% del FOB si no se especifica)
 * 4. = Valor CIF USD
 * 5. Base Arancelaria COP = CIF USD × TRM
 * 6. Total Arancel = Base Arancelaria × (Arancel% / 100)
 * 7. Base IVA = Base Arancelaria + Total Arancel
 * 8. Total IVA = Base IVA × (19% / 100)
 * 9. Total Impuestos = Total Arancel + Total IVA
 * 10. Gastos Nacionalización = (opcionales)
 * 11. Total a Pagar = Total Impuestos + Gastos Nacionalización
 */
function calcularImportacionOrdinaria(v) {
    // 1. Valor FOB (USD)
    const fob = v.fob;
    
    // 2. Flete Internacional (USD)
    const flete = v.flete;
    
    // 3. Seguro Internacional: si es 0, calcular 0.5% del FOB
    let seguro = v.seguro;
    if (seguro === 0) {
        seguro = fob * 0.005;  // 0.5% del FOB
    }
    
    // 4. Valor CIF USD (Total Aduana en USD)
    const cifUSD = fob + flete + seguro;
    
    // 5. Base Arancelaria COP = CIF USD × TRM
    const baseArancelariaCOP = cifUSD * v.trm;
    
    // 6. Total Arancel = Base Arancelaria × porcentaje
    const totalArancel = baseArancelariaCOP * (v.arancel / 100);
    
    // 7. Base IVA = Base Arancelaria + Total Arancel
    const baseIVA = baseArancelariaCOP + totalArancel;
    
    // 8. Total IVA = Base IVA × 19%
    const totalIVA = baseIVA * (v.iva / 100);
    
    // 9. Total Impuestos (Tributos Aduaneros) = Arancel + IVA
    const totalImpuestos = totalArancel + totalIVA;
    
    // 10. Gastos de nacionalización (COP)
    const gastosNacionalizacion = v.agencia + v.bodegaje + v.transporte;
    
    // 11. Total a Pagar = Tributos + Gastos nacionalización
    const totalPagar = totalImpuestos + gastosNacionalizacion;
    
    // Redondear todos los valores COP
    return {
        // Valores en USD
        fob,
        flete,
        seguro,
        cifUSD,
        
        // Valores en COP (redondeados)
        baseArancelariaCOP: redondear(baseArancelariaCOP),
        totalArancel: redondear(totalArancel),
        baseIVA: redondear(baseIVA),
        totalIVA: redondear(totalIVA),
        totalImpuestos: redondear(totalImpuestos),
        gastosNacionalizacion: redondear(gastosNacionalizacion),
        totalPagar: redondear(totalPagar),
        
        // Metadata
        arancelPorcentaje: v.arancel,
        ivaPorcentaje: v.iva,
        trm: v.trm
    };
}

// ========== FUNCIÓN PARA EL COLABSABLE ==========

function initCollapsibleInfo() {
    const header = document.getElementById('infoHeader');
    const content = document.getElementById('infoContent');
    const arrow = document.querySelector('.info-arrow');
    
    // Si no existe el header (porque no es la modalidad ordinaria), salir
    if (!header || !content) return;
    
    // Asegurar estado inicial cerrado
    content.style.display = 'none';
    if (arrow) arrow.classList.remove('open');
    
    // Remover event listeners anteriores para evitar duplicados
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);
    
    newHeader.addEventListener('click', () => {
        const currentContent = document.getElementById('infoContent');
        const currentArrow = newHeader.querySelector('.info-arrow');
        
        if (currentContent.style.display === 'none') {
            currentContent.style.display = 'block';
            if (currentArrow) currentArrow.classList.add('open');
        } else {
            currentContent.style.display = 'none';
            if (currentArrow) currentArrow.classList.remove('open');
        }
    });
}

// ========== MODALIDADES ==========

const modalidades = {
  ordinaria: {
    titulo: 'Importación Ordinaria',
    badge: 'C100',
    subtitulo: 'Declaración ordinaria — mercancías para consumo definitivo en Colombia',
    info: `
      <div class="info-collapsible">
        <div class="info-header" id="infoHeader">
          <span class="info-arrow">▶</span>
          <strong>📋 Secuencia de cálculo</strong>
        </div>
        <div class="info-content" id="infoContent" style="display: none;">
          <ol style="margin-top: 8px; padding-left: 20px;">
            <li>Valor FOB (USD)</li>
            <li>+ Flete Internacional (USD)</li>
            <li>+ Seguro Internacional (0.5% del FOB si no se especifica)</li>
            <li><strong>= Valor CIF USD</strong> (Total Aduana en dólares)</li>
            <li>× TRM = <strong>Base Arancelaria COP</strong></li>
            <li>× %Arancel = <strong>Total Arancel</strong></li>
            <li>Base Arancelaria + Arancel = <strong>Base IVA</strong></li>
            <li>× 19% = <strong>Total IVA</strong></li>
            <li>Arancel + IVA = <strong>Total Impuestos (Tributos Aduaneros)</strong></li>
            <li>+ Gastos Nacionalización = <strong>TOTAL A PAGAR</strong></li>
          </ol>
        </div>
      </div>
    `,
    campos: ['fob', 'flete', 'seguro', 'arancel', 'iva', 'trm', 'agencia', 'bodegaje', 'transporte'],
    calcular: (v) => {
      const r = calcularImportacionOrdinaria(v);
      
      return [
        // PASOS 1-4: Valores en USD
        { label: '1. Valor FOB', valor: formatUSD(r.fob), clase: '' },
        { label: '2. + Flete Internacional', valor: formatUSD(r.flete), clase: '' },
        { label: '3. + Seguro Internacional', valor: formatUSD(r.seguro), clase: '' },
        { label: '4. = Valor CIF USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
        
        // SEPARADOR
        { label: '──────────────────', valor: '', clase: 'separador' },
        
        // PASO 5: Base Arancelaria
        { label: `5. Base Arancelaria (CIF × TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.baseArancelariaCOP), clase: '' },
        
        // PASO 6: Arancel
        { label: `6. + Arancel (${r.arancelPorcentaje}%)`, valor: formatCOP(r.totalArancel), clase: '' },
        
        // PASO 7: Base IVA
        { label: '7. = Base IVA', valor: formatCOP(r.baseIVA), clase: 'destacado' },
        
        // PASO 8: IVA
        { label: `8. + IVA (${r.ivaPorcentaje}%)`, valor: formatCOP(r.totalIVA), clase: '' },
        
        // PASO 9: Total Impuestos
        { label: '9. = Total Impuestos (Tributos Aduaneros)', valor: formatCOP(r.totalImpuestos), clase: 'destacado' },
        
        // SEPARADOR
        { label: '──────────────────', valor: '', clase: 'separador' },
        
        // Gastos Nacionalización
        { label: '10. + Gastos de nacionalización', valor: formatCOP(r.gastosNacionalizacion), clase: '' },
        
        // TOTAL
        { label: '11. TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' }
      ];
    }
  },

  franquicia: {
    titulo: 'Importación con Franquicia',
    badge: 'C110',
    subtitulo: 'Exención total o parcial de tributos aduaneros',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Cuando existe una norma legal que exime del pago de aranceles e IVA. Aplica a embajadas, organismos internacionales, donaciones, etc.`,
    campos: ['fob', 'flete', 'seguro', 'trm', 'agencia', 'tipoFranquicia'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos);
      
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
  },

  reimportacion: {
    titulo: 'Reimportación en el mismo estado',
    badge: 'C160',
    subtitulo: 'Mercancías que regresan a Colombia sin transformación',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Cuando mercancías colombianas que salieron temporalmente regresan sin modificación. Exenta de tributos si se acredita origen nacional.`,
    campos: ['fob', 'flete', 'seguro', 'trm', 'agencia'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos);
      
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
  },

  garantia: {
    titulo: 'Importación en cumplimiento de garantía',
    badge: 'C170',
    subtitulo: 'Reposición de mercancías defectuosas por el proveedor',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Cuando el proveedor envía mercancía de reposición por garantía. Exenta de tributos.`,
    campos: ['fob', 'flete', 'seguro', 'trm', 'agencia'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos);
      
      return [
        { label: 'Valor FOB (mercancía repuesta)', valor: formatUSD(v.fob) },
        { label: '+ Flete', valor: formatUSD(v.flete) },
        { label: '+ Seguro', valor: formatUSD(seguro) },
        { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
        { label: 'Arancel', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: 'IVA', valor: '$ 0 — EXENTO', clase: 'exento' },
        { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  'temporal-corto': {
    titulo: 'Importación Temporal — Corto Plazo',
    badge: 'C150',
    subtitulo: 'Hasta 6 meses — tributos suspendidos con garantía',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Para mercancías que entran temporalmente y serán reexportadas en máximo 6 meses. Los tributos quedan suspendidos y se garantizan con póliza.`,
    campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'meses'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const totalArancel = baseArancelariaCOP * (v.arancel / 100);
      const baseIVA = baseArancelariaCOP + totalArancel;
      const totalIVA = baseIVA * 0.19;
      const tributosSuspendidos = totalArancel + totalIVA;
      const poliza = tributosSuspendidos * 0.015;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos + poliza);
      
      return [
        { label: 'Valor FOB', valor: formatUSD(v.fob) },
        { label: '+ Flete', valor: formatUSD(v.flete) },
        { label: '+ Seguro', valor: formatUSD(seguro) },
        { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
        { label: 'Base Arancelaria COP', valor: formatCOP(baseArancelariaCOP) },
        { label: `Arancel (${v.arancel}%) — SUSPENDIDO`, valor: formatCOP(totalArancel), clase: 'suspendido' },
        { label: 'IVA (19%) — SUSPENDIDO', valor: formatCOP(totalIVA), clase: 'suspendido' },
        { label: 'Tributos suspendidos', valor: formatCOP(tributosSuspendidos), clase: 'suspendido' },
        { label: '+ Póliza de garantía (1.5%)', valor: formatCOP(poliza) },
        { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
        { label: `Plazo: ${v.meses} meses`, valor: '' },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  'temporal-largo': {
    titulo: 'Importación Temporal — Largo Plazo',
    badge: 'C155',
    subtitulo: 'Más de 6 meses — pago proporcional de tributos',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Para bienes de capital, equipos o maquinaria por más de 6 meses. Se paga un porcentaje mensual de los tributos.`,
    campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'meses'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const totalArancel = baseArancelariaCOP * (v.arancel / 100);
      const baseIVA = baseArancelariaCOP + totalArancel;
      const totalIVA = baseIVA * 0.19;
      const tributosTotales = totalArancel + totalIVA;
      const pagoPorMes = tributosTotales * 0.01;
      const totalTributos = pagoPorMes * v.meses;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos + totalTributos);
      
      return [
        { label: 'Valor FOB', valor: formatUSD(v.fob) },
        { label: '+ Flete', valor: formatUSD(v.flete) },
        { label: '+ Seguro', valor: formatUSD(seguro) },
        { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
        { label: 'Base Arancelaria COP', valor: formatCOP(baseArancelariaCOP) },
        { label: `Arancel (${v.arancel}%) total`, valor: formatCOP(totalArancel) },
        { label: 'IVA (19%) total', valor: formatCOP(totalIVA) },
        { label: 'Tributos totales', valor: formatCOP(tributosTotales) },
        { label: '1% mensual', valor: formatCOP(pagoPorMes) },
        { label: `× ${v.meses} meses`, valor: formatCOP(totalTributos), clase: 'destacado' },
        { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  perfeccionamiento: {
    titulo: 'Perfeccionamiento Activo',
    badge: 'C200',
    subtitulo: 'Insumos que serán transformados y reexportados',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Para importar materias primas que serán transformadas en Colombia y luego reexportadas. Los tributos quedan suspendidos.`,
    campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const baseArancelariaCOP = cifUSD * v.trm;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + gastos);
      
      return [
        { label: 'Valor FOB insumos', valor: formatUSD(v.fob) },
        { label: '+ Flete', valor: formatUSD(v.flete) },
        { label: '+ Seguro', valor: formatUSD(seguro) },
        { label: '= Valor CIF', valor: formatUSD(cifUSD), clase: 'destacado' },
        { label: 'Base Arancelaria COP', valor: formatCOP(baseArancelariaCOP) },
        { label: `Arancel (${v.arancel}%) — SUSPENDIDO`, valor: '$ 0', clase: 'suspendido' },
        { label: 'IVA (19%) — SUSPENDIDO', valor: '$ 0', clase: 'suspendido' },
        { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  transformacion: {
    titulo: 'Transformación y Ensamble',
    badge: 'C210',
    subtitulo: 'Componentes para ensamblar productos en Colombia',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Para importar partes y piezas que serán ensambladas en Colombia. Los tributos se calculan sobre el porcentaje importado.`,
    campos: ['fob', 'flete', 'seguro', 'arancel', 'trm', 'agencia', 'pctImportado'],
    calcular: (v) => {
      const seguro = v.seguro > 0 ? v.seguro : v.fob * 0.005;
      const cifUSD = v.fob + v.flete + seguro;
      const cifImportadoUSD = cifUSD * (v.pctImportado / 100);
      const baseArancelariaCOP = cifImportadoUSD * v.trm;
      const totalArancel = baseArancelariaCOP * (v.arancel / 100);
      const baseIVA = baseArancelariaCOP + totalArancel;
      const totalIVA = baseIVA * 0.19;
      const gastos = v.agencia;
      const totalPagar = redondear(baseArancelariaCOP + totalArancel + totalIVA + gastos);
      
      return [
        { label: 'Valor FOB total', valor: formatUSD(v.fob) },
        { label: '+ Flete', valor: formatUSD(v.flete) },
        { label: '+ Seguro', valor: formatUSD(seguro) },
        { label: '= Valor CIF total', valor: formatUSD(cifUSD), clase: '' },
        { label: `Componente importado (${v.pctImportado}%)`, valor: formatUSD(cifImportadoUSD), clase: 'destacado' },
        { label: 'Base Arancelaria COP', valor: formatCOP(baseArancelariaCOP) },
        { label: `+ Arancel (${v.arancel}%)`, valor: formatCOP(totalArancel) },
        { label: '= Base IVA', valor: formatCOP(baseIVA) },
        { label: `+ IVA (19%)`, valor: formatCOP(totalIVA) },
        { label: '+ Gastos nacionalización', valor: formatCOP(gastos) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  postal: {
    titulo: 'Tráfico Postal y Envíos Urgentes',
    badge: 'C820',
    subtitulo: 'Paquetes internacionales y courier',
    info: `<strong>📋 Régimen simplificado:</strong>
      <ul><li>Hasta USD 200: libre de tributos</li><li>USD 200 a USD 2.000: tarifa plana 10% + IVA</li><li>Más de USD 2.000: tributos ordinarios</li></ul>`,
    campos: ['fob', 'trm'],
    calcular: (v) => {
      let arancel = 0, iva = 0, regimen = '';
      if (v.fob <= 200) {
        regimen = 'Libre de tributos (≤ USD 200)';
      } else if (v.fob <= 2000) {
        arancel = v.fob * 0.10;
        iva = (v.fob + arancel) * 0.19;
        regimen = 'Tarifa plana 10% + IVA';
      } else {
        arancel = v.fob * 0.15;
        iva = (v.fob + arancel) * 0.19;
        regimen = 'Tributos ordinarios';
      }
      const totalPagar = redondear((v.fob + arancel + iva) * v.trm);
      
      return [
        { label: 'Valor del paquete (FOB)', valor: formatUSD(v.fob) },
        { label: 'Régimen aplicable', valor: regimen, clase: 'destacado' },
        { label: '+ Arancel', valor: formatUSD(arancel) },
        { label: '+ IVA (19%)', valor: formatUSD(iva) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  muestras: {
    titulo: 'Muestras sin Valor Comercial',
    badge: 'C840',
    subtitulo: 'Muestras para fines comerciales sin valor de venta',
    info: `<strong>📋 ¿Cuándo se usa?</strong> Para importar muestras con fines comerciales. Exentas de tributos hasta USD 1.000.`,
    campos: ['fob', 'trm', 'agencia'],
    calcular: (v) => {
      const exenta = v.fob <= 1000;
      const arancel = exenta ? 0 : v.fob * 0.15;
      const iva = exenta ? 0 : (v.fob + arancel) * 0.19;
      const totalPagar = redondear((v.fob + arancel + iva) * v.trm) + v.agencia;
      
      return [
        { label: 'Valor de las muestras', valor: formatUSD(v.fob) },
        { label: 'Arancel', valor: exenta ? '$ 0 — EXENTO' : formatUSD(arancel), clase: exenta ? 'exento' : '' },
        { label: 'IVA', valor: exenta ? '$ 0 — EXENTO' : formatUSD(iva), clase: exenta ? 'exento' : '' },
        { label: '+ Gastos nacionalización', valor: formatCOP(v.agencia) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  },

  viajeros: {
    titulo: 'Viajeros — Equipaje y Menaje',
    badge: 'C900',
    subtitulo: 'Importación de bienes de viajeros internacionales',
    info: `<strong>📋 Cupos libres:</strong>
      <ul><li>Vía aérea: USD 500</li><li>Vía terrestre/marítima: USD 300</li><li>Excedente: 15% + IVA</li></ul>`,
    campos: ['fob', 'trm', 'viaAerea'],
    calcular: (v) => {
      const cupo = v.viaAerea ? 500 : 300;
      const excedente = Math.max(0, v.fob - cupo);
      const arancel = excedente * 0.15;
      const iva = (excedente + arancel) * 0.19;
      const totalPagar = redondear((excedente + arancel + iva) * v.trm);
      
      return [
        { label: 'Valor total bienes', valor: formatUSD(v.fob) },
        { label: `Cupo libre (${v.viaAerea ? 'aéreo' : 'terrestre'})`, valor: formatUSD(cupo), clase: 'exento' },
        { label: 'Excedente gravable', valor: formatUSD(excedente), clase: 'destacado' },
        { label: '+ Arancel (15%)', valor: formatUSD(arancel) },
        { label: '+ IVA (19%)', valor: formatUSD(iva) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(totalPagar), clase: 'total' }
      ];
    }
  }
};

// ========== CAMPOS HTML ==========

const camposHTML = {
  fob: `<div class="input-group"><label>Valor FOB (USD)</label><input type="number" step="0.01" id="fob" placeholder="Ej: 125000.00" min="0"></div>`,
  flete: `<div class="input-group"><label>Flete internacional (USD)</label><input type="number" step="0.01" id="flete" placeholder="Ej: 7500.00" min="0"></div>`,
  seguro: `<div class="input-group"><label>Seguro (USD) <span class="hint">— 0 = calcular 0.5% del FOB</span></label><input type="number" step="0.01" id="seguro" placeholder="0" min="0"></div>`,
  arancel: `<div class="input-group"><label>Arancel (%)</label><input type="number" step="0.01" id="arancel" placeholder="Ej: 15" min="0" max="100"></div>`,
  iva: `<div class="input-group"><label>IVA (%)</label><input type="number" step="0.01" id="iva" placeholder="19" value="19" min="0" max="100"></div>`,
  trm: `<div class="input-group"><label>TRM (COP por USD)</label><input type="number" step="0.01" id="trm" placeholder="Ej: 3660.10"><span class="trm-status" id="trm-status"></span></div>`,
  agencia: `<div class="input-group"><label>Agencia de aduanas (COP)</label><input type="number" step="0.01" id="agencia" placeholder="Ej: 500000" min="0"></div>`,
  bodegaje: `<div class="input-group"><label>Almacenamiento / bodegaje (COP)</label><input type="number" step="0.01" id="bodegaje" placeholder="Ej: 200000" min="0"></div>`,
  transporte: `<div class="input-group"><label>Transporte interno (COP)</label><input type="number" step="0.01" id="transporte" placeholder="Ej: 300000" min="0"></div>`,
  meses: `<div class="input-group"><label>Meses de permanencia</label><input type="number" id="meses" placeholder="Ej: 6" min="1" max="60"></div>`,
  pctImportado: `<div class="input-group"><label>Porcentaje de componente importado (%)</label><input type="number" step="0.01" id="pctImportado" placeholder="Ej: 60" min="0" max="100"></div>`,
  tipoFranquicia: `<div class="input-group"><label>Tipo de franquicia</label><select id="tipoFranquicia"><option value="diplomatica">Diplomática / Consular</option><option value="organismos">Organismos internacionales</option><option value="donacion">Donación</option><option value="otra">Otra</option></select></div>`,
  viaAerea: `<div class="input-group"><label>Modo de ingreso</label><select id="viaAerea"><option value="1">Vía aérea (cupo USD 500)</option><option value="0">Vía terrestre / marítima (cupo USD 300)</option></select></div>`
};

// ========== CARGA DE TRM ==========

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

// ========== RENDER MODAL ==========

function renderModal(key) {
  const m = modalidades[key];
  if (!m) return;

  document.getElementById('modal-titulo').textContent = m.titulo;
  document.getElementById('modal-subtitulo').textContent = m.subtitulo;
  document.getElementById('modal-badge').textContent = m.badge;

  const infoBar = document.getElementById('modal-info-bar');
  infoBar.innerHTML = m.info;
  infoBar.classList.add('visible');
  
  // Inicializar el colapsable (solo para la modalidad ordinaria)
  if (key === 'ordinaria') {
    initCollapsibleInfo();
  }

  const form = document.getElementById('calc-form');
  form.innerHTML = `
    <div class="form-section">
      <h3>📋 Datos de la operación</h3>
      ${m.campos.map(c => camposHTML[c] || '').join('')}
    </div>
    <button class="btn-calcular" id="btnCalcular">💰 Calcular</button>
  `;

  document.getElementById('resultados').style.display = 'none';
  cargarTRM();

  // Event listener para el botón calcular
  const btnCalcular = document.getElementById('btnCalcular');
  if (btnCalcular) {
    const newBtn = btnCalcular.cloneNode(true);
    btnCalcular.parentNode.replaceChild(newBtn, btnCalcular);
    
    newBtn.addEventListener('click', () => {
      const val = (id) => {
        const el = document.getElementById(id);
        return el ? toNumber(el.value) : 0;
      };
      
      const selectVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
      };
      
      const v = {
        fob: val('fob'),
        flete: val('flete'),
        seguro: val('seguro'),
        arancel: val('arancel'),
        iva: val('iva') || 19,
        trm: val('trm'),
        agencia: val('agencia'),
        bodegaje: val('bodegaje'),
        transporte: val('transporte'),
        meses: val('meses'),
        pctImportado: val('pctImportado'),
        viaAerea: selectVal('viaAerea') === '1',
        tipoFranquicia: selectVal('tipoFranquicia')
      };

      if (v.fob === 0 && m.campos.includes('fob')) { 
        alert('⚠️ Ingresa el valor FOB.'); 
        return; 
      }
      if (v.trm === 0 && m.campos.includes('trm')) { 
        alert('⚠️ Ingresa la TRM.'); 
        return; 
      }

      const filas = m.calcular(v);
      const contenido = document.getElementById('resultados-contenido');
      contenido.innerHTML = filas.map(f =>
        `<div class="resultado-item ${f.clase || ''}">
          <span>${f.label}</span>
          <span>${f.valor}</span>
        </div>`
      ).join('');

      document.getElementById('resultados').style.display = 'block';
      document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ========== NAVEGACIÓN ==========

function initNavigation() {
  const toggle = document.getElementById('importacion-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const submenu = document.getElementById('importacion-submenu');
      const arrow = document.querySelector('.arrow');
      if (submenu && arrow) {
        submenu.classList.toggle('open');
        arrow.classList.toggle('open');
      }
    });
  }

  document.querySelectorAll('.nav-subitem').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-subitem').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderModal(item.dataset.modal);
    });
  });
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
  const submenu = document.getElementById('importacion-submenu');
  const arrow = document.querySelector('.arrow');
  if (submenu && arrow) {
    submenu.classList.add('open');
    arrow.classList.add('open');
  }
  initNavigation();
  renderModal('ordinaria');
});