// Descripciones de Incoterms
const incoterms = {
  FOB: 'FOB — El vendedor entrega a bordo del buque. El comprador asume flete y seguro.',
  EXW: 'EXW — El vendedor pone la mercancía en su fábrica. El comprador asume todo el transporte.',
  CIF: 'CIF — El vendedor asume flete y seguro hasta el puerto de destino.',
  DDP: 'DDP — El vendedor asume todos los costos incluyendo aranceles hasta el destino final.',
  CFR: 'CFR — El vendedor asume el flete pero no el seguro hasta el puerto de destino.',
  FCA: 'FCA — El vendedor entrega al transportista designado por el comprador.'
};

// Vistos buenos por tipo de subpartida
const vistosBuenos = [
  { prefijos: ['01','02','03','04','05'], entidad: 'ICA', descripcion: 'Instituto Colombiano Agropecuario — productos animales y agropecuarios.' },
  { prefijos: ['06','07','08','09','10','11','12'], entidad: 'ICA', descripcion: 'ICA — productos vegetales, semillas y material de propagación.' },
  { prefijos: ['21','22'], entidad: 'INVIMA', descripcion: 'INVIMA — alimentos procesados y bebidas.' },
  { prefijos: ['29','30'], entidad: 'INVIMA', descripcion: 'INVIMA — productos farmacéuticos y químicos.' },
  { prefijos: ['33','34'], entidad: 'INVIMA', descripcion: 'INVIMA — cosméticos y productos de aseo.' },
  { prefijos: ['36','93'], entidad: 'MinDefensa', descripcion: 'Ministerio de Defensa — explosivos, armas y municiones.' },
  { prefijos: ['85','84'], entidad: 'SIC', descripcion: 'Superintendencia de Industria — equipos eléctricos y electrónicos.' },
  { prefijos: ['28','38'], entidad: 'ANLA', descripcion: 'ANLA — sustancias químicas y productos peligrosos.' },
];

// Selección de Incoterm
document.querySelectorAll('.incoterm-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.incoterm-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('incoterm-desc').textContent = incoterms[btn.dataset.term];
  });
});

// Cargar TRM automática
async function cargarTRM() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
    const data = await res.json();
    const trm = data.rates.COP;
    document.getElementById('trm').value = Math.round(trm);
    document.getElementById('trm-status').textContent = `✅ TRM cargada automáticamente — ${new Date().toLocaleDateString('es-CO')}`;
  } catch {
    document.getElementById('trm-status').textContent = '⚠️ No se pudo cargar la TRM. Ingrésala manualmente.';
  }
}

cargarTRM();

// Calcular
document.getElementById('btnCalcular').addEventListener('click', () => {
  const fob = parseFloat(document.getElementById('fob').value) || 0;
  const flete = parseFloat(document.getElementById('flete').value) || 0;
  let seguro = parseFloat(document.getElementById('seguro').value) || 0;
  const arancelPct = parseFloat(document.getElementById('arancel').value) || 0;
  const trm = parseFloat(document.getElementById('trm').value) || 0;
  const agencia = parseFloat(document.getElementById('agencia').value) || 0;
  const bodegaje = parseFloat(document.getElementById('bodegaje').value) || 0;
  const transporte = parseFloat(document.getElementById('transporte').value) || 0;
  const subpartida = document.getElementById('subpartida').value.trim();

  if (fob === 0 || trm === 0) {
    alert('Ingresa al menos el valor FOB y la TRM.');
    return;
  }

  // Seguro automático si no se ingresó
  if (seguro === 0) seguro = fob * 0.005;

  // Cálculos
  const cif = fob + flete + seguro;
  const arancelUSD = cif * (arancelPct / 100);
  const ivaBase = cif + arancelUSD;
  const iva = ivaBase * 0.19;
  const nacionalizacion = agencia + bodegaje + transporte;

  const totalUSD = cif + arancelUSD + iva;
  const totalCOP = (totalUSD * trm) + nacionalizacion;

  // Mostrar resultados
  const usd = v => `USD ${v.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const cop = v => `COP ${v.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  document.getElementById('r-fob').textContent = usd(fob);
  document.getElementById('r-flete').textContent = usd(flete);
  document.getElementById('r-seguro').textContent = usd(seguro);
  document.getElementById('r-cif').textContent = usd(cif);
  document.getElementById('r-arancel').textContent = `${usd(arancelUSD)} (${arancelPct}%)`;
  document.getElementById('r-iva').textContent = usd(iva);
  document.getElementById('r-nac').textContent = cop(nacionalizacion);
  document.getElementById('r-total').textContent = cop(totalCOP);

  // Vistos buenos
  const vbLista = document.getElementById('vb-lista');
  vbLista.innerHTML = '';

  if (subpartida) {
    const prefijo = subpartida.replace(/\./g, '').substring(0, 2);
    const encontrados = vistosBuenos.filter(vb => vb.prefijos.includes(prefijo));

    if (encontrados.length > 0) {
      encontrados.forEach(vb => {
        vbLista.innerHTML += `
          <div class="vb-item">
            <strong>${vb.entidad}</strong>
            ${vb.descripcion}
          </div>`;
      });
    } else {
      vbLista.innerHTML = '<div class="vb-item">✅ No se identificaron vistos buenos especiales para esta subpartida.</div>';
    }
  } else {
    vbLista.innerHTML = '<div class="vb-item">⚠️ Ingresa la subpartida arancelaria para verificar vistos buenos.</div>';
  }

  document.getElementById('resultados').style.display = 'block';
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
});