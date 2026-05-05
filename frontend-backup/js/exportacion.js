const incoterms = {
  EXW: 'EXW — El comprador asume todos los costos desde tu fábrica.',
  FOB: 'FOB — Entregas a bordo del buque. El comprador asume flete y seguro.',
  CIF: 'CIF — Asumes flete y seguro hasta el puerto de destino.',
  CFR: 'CFR — Asumes el flete pero no el seguro hasta el puerto de destino.',
  DAP: 'DAP — Asumes todos los costos hasta el lugar de destino acordado.',
  DDP: 'DDP — Asumes absolutamente todo, incluyendo aranceles en destino.'
};

const documentos = {
  base: [
    'Factura comercial (Commercial Invoice)',
    'Lista de empaque (Packing List)',
    'Declaración de exportación (DEX)',
    'Registro de productor nacional (si aplica)'
  ],
  maritimo: [
    'Conocimiento de embarque (Bill of Lading — B/L)',
    'Instrucciones de embarque (Shipping Instructions)'
  ],
  aereo: [
    'Guía aérea (Air Waybill — AWB)'
  ],
  origen: [
    'Certificado de origen (según acuerdo comercial)'
  ],
  fitosanitario: ['01','02','03','04','05','06','07','08','09','10','11','12'],
  invima: ['21','22','29','30','33','34']
};

const tlcPaises = {
  USA: 'TLC Colombia–EE.UU. (2012) — arancel 0% en miles de productos.',
  PER: 'Acuerdo CAN — libre comercio entre países andinos.',
  ECU: 'Acuerdo CAN — libre comercio entre países andinos.',
  MEX: 'TLC Colombia–México (G2) — preferencias arancelarias.',
  CRI: 'TLC Colombia–Centroamérica — arancel reducido o 0%.',
  PAN: 'TLC Colombia–Panamá — preferencias arancelarias.',
  ESP: 'Acuerdo Colombia–UE — arancel reducido o 0%.',
  DEU: 'Acuerdo Colombia–UE — arancel reducido o 0%.',
  CHN: '⚠️ Sin TLC vigente. Aranceles estándar aplican.',
  BRA: '⚠️ Acuerdo parcial CAN–Mercosur. Cobertura limitada.'
};

// Incoterm selector
document.querySelectorAll('.incoterm-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.incoterm-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('incoterm-desc').textContent = incoterms[btn.dataset.term];
  });
});

// Cargar TRM
async function cargarTRM() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP');
    const data = await res.json();
    document.getElementById('trm').value = Math.round(data.rates.COP);
    document.getElementById('trm-status').textContent = `✅ TRM cargada — ${new Date().toLocaleDateString('es-CO')}`;
  } catch {
    document.getElementById('trm-status').textContent = '⚠️ Ingresa la TRM manualmente.';
  }
}

cargarTRM();

// Calcular
document.getElementById('btnCalcular').addEventListener('click', () => {
  const exw = parseFloat(document.getElementById('exw').value) || 0;
  const trm = parseFloat(document.getElementById('trm').value) || 0;
  const transporte = parseFloat(document.getElementById('transporte').value) || 0;
  const agencia = parseFloat(document.getElementById('agencia').value) || 0;
  const certOrigen = parseFloat(document.getElementById('certOrigen').value) || 0;
  const fleteUSD = parseFloat(document.getElementById('flete').value) || 0;
  const seguroUSD = parseFloat(document.getElementById('seguro').value) || 0;
  const otros = parseFloat(document.getElementById('otros').value) || 0;
  const subpartida = document.getElementById('subpartida').value.trim();
  const pais = document.getElementById('pais').value;
  const incoterm = document.querySelector('.incoterm-btn.active').dataset.term;
  const drawback = document.getElementById('drawback').checked;
  const zonaFranca = document.getElementById('zonaFranca').checked;
  const tlc = document.getElementById('tlc').checked;

  if (exw === 0 || trm === 0) {
    alert('Ingresa al menos el precio EXW y la TRM.');
    return;
  }

  const fleteCOP = fleteUSD * trm;
  const seguroCOP = seguroUSD * trm;

  const fob = exw + transporte + agencia + certOrigen + otros;
  const cif = fob + fleteCOP + seguroCOP;

  const precioSegunIncoterm = {
    EXW: exw,
    FOB: fob,
    CFR: fob + fleteCOP,
    CIF: cif,
    DAP: cif,
    DDP: cif
  };

  const total = precioSegunIncoterm[incoterm];
  const totalUSD = total / trm;

  const cop = v => `COP ${v.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  const usd = v => `USD ${v.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  document.getElementById('r-exw').textContent = cop(exw);
  document.getElementById('r-transporte').textContent = cop(transporte);
  document.getElementById('r-agencia').textContent = cop(agencia);
  document.getElementById('r-cert').textContent = cop(certOrigen);
  document.getElementById('r-fob').textContent = cop(fob);
  document.getElementById('r-flete').textContent = cop(fleteCOP);
  document.getElementById('r-seguro').textContent = cop(seguroCOP);
  document.getElementById('r-cif').textContent = cop(cif);
  document.getElementById('r-total').textContent = cop(total);
  document.getElementById('r-usd').textContent = usd(totalUSD);

  // Incentivos
  const incDiv = document.getElementById('incentivos-result');
  incDiv.innerHTML = '';
  const incentivosActivos = [];
  if (drawback) incentivosActivos.push('✅ Drawback — puedes solicitar devolución de aranceles pagados en insumos importados ante la DIAN.');
  if (zonaFranca) incentivosActivos.push('✅ Zona Franca — exención de IVA y arancel en materias primas utilizadas.');
  if (tlc && pais && tlcPaises[pais]) incentivosActivos.push(`✅ ${tlcPaises[pais]}`);
  if (pais && !tlc && tlcPaises[pais]) incentivosActivos.push(`💡 ${tlcPaises[pais]}`);

  if (incentivosActivos.length > 0) {
    incDiv.innerHTML = `<div class="vistos-buenos" style="margin-top:16px"><h3>💰 Incentivos y acuerdos</h3>${
      incentivosActivos.map(i => `<div class="vb-item">${i}</div>`).join('')
    }</div>`;
  }

  // Documentos
  const docsLista = document.getElementById('docs-lista');
  docsLista.innerHTML = '';
  let docs = [...documentos.base, ...documentos.maritimo];
  if (document.getElementById('certOrigen').value > 0 || tlc) docs.push(...documentos.origen);

  if (subpartida) {
    const prefijo = subpartida.replace(/\./g, '').substring(0, 2);
    if (documentos.fitosanitario.includes(prefijo)) docs.push('Certificado fitosanitario (ICA)');
    if (documentos.invima.includes(prefijo)) docs.push('Registro INVIMA / visto bueno sanitario');
  }

  docs.forEach(doc => {
    docsLista.innerHTML += `<div class="vb-item">📄 ${doc}</div>`;
  });

  document.getElementById('resultados').style.display = 'block';
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
});