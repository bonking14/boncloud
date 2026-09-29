// ============================================================
//  BonCloud — Centro de formularios DIAN (simuladores de práctica)
//  Cada formulario vive en pages/formularios/ y se abre en un iframe.
//  No tienen validez ante la DIAN: las declaraciones reales se presentan
//  con firma digital en los servicios informáticos de la DIAN.
// ============================================================

const formularios = [
  { id: '001', archivo: 'form-001-rut.html', nombre: 'Formulario 001 - Registro Único Tributario (RUT)', tipo: 'Requisito',
    desc: 'Inscripción del importador o exportador, con su calidad de usuario aduanero.' },
  { id: '560', archivo: 'form-560-dav.html', nombre: 'Formulario 560 - Declaración Andina del Valor (DAV)', tipo: 'Importación',
    desc: 'Soporta el valor en aduana. Obligatoria desde USD 5.000 FOB.' },
  { id: '500', archivo: 'form-500-importacion.html', nombre: 'Formulario 500 - Declaración de Importación', tipo: 'Importación',
    desc: 'Identifica la mercancía, declara el valor en aduana y liquida arancel e IVA.' },
  { id: 'DTA', archivo: 'form-dta-transito.html', nombre: 'Declaración de Tránsito Aduanero (DTA)', tipo: 'Tránsito',
    desc: 'Traslado bajo control aduanero entre aduanas, con tributos suspendidos.' },
  { id: '600', archivo: 'form-600-exportacion.html', nombre: 'Formulario 600 - Declaración de Exportación (DEX)', tipo: 'Exportación',
    desc: 'Ampara la salida de mercancías; va precedida de la solicitud de autorización de embarque.' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderGrid(formularios);

  const buscador = document.getElementById('buscador-forms');
  buscador.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    renderGrid(formularios.filter(f =>
      f.nombre.toLowerCase().includes(query) ||
      f.tipo.toLowerCase().includes(query) ||
      f.id.toLowerCase().includes(query)
    ));
  });

  document.getElementById('btn-volver').addEventListener('click', () => {
    document.getElementById('vista-editor').style.display = 'none';
    document.getElementById('vista-dashboard').style.display = 'block';
    document.getElementById('form-render-area').innerHTML = '';
  });

  document.getElementById('btn-limpiar').addEventListener('click', () => {
    const iframe = document.getElementById('form-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.location.reload();
  });

  document.getElementById('btn-descargar').addEventListener('click', () => {
    const iframe = document.getElementById('form-iframe');
    if (!iframe || !iframe.contentWindow) return;
    if (typeof iframe.contentWindow.validateAndPrint === 'function') {
      iframe.contentWindow.validateAndPrint();
    } else {
      iframe.contentWindow.print();
    }
  });

  // La Ruta de Aprendizaje abre esta página con ?form=500
  const inicial = new URLSearchParams(window.location.search).get('form');
  if (inicial && formularios.some(f => f.id === inicial.toUpperCase())) {
    openFormEditor(inicial.toUpperCase());
  }
});

function renderGrid(lista) {
  const grid = document.getElementById('grid-formularios');
  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted);">No se encontraron formularios.</p>';
    return;
  }

  lista.forEach(form => {
    const div = document.createElement('div');
    div.className = 'form-card';
    div.setAttribute('role', 'button');
    div.tabIndex = 0;
    div.innerHTML = `
      <h3>${form.nombre}</h3>
      <p style="font-size:0.8rem;opacity:.75;margin:6px 0 10px;line-height:1.4">${form.desc}</p>
      <span class="tag-tipo">${form.tipo}</span>
    `;
    div.addEventListener('click', () => openFormEditor(form.id));
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFormEditor(form.id); }
    });
    grid.appendChild(div);
  });
}

function openFormEditor(id) {
  const form = formularios.find(f => f.id === id);
  if (!form) return;
  document.getElementById('vista-dashboard').style.display = 'none';
  document.getElementById('vista-editor').style.display = 'block';
  document.getElementById('form-render-area').innerHTML =
    `<iframe id="form-iframe" src="formularios/${form.archivo}" title="${form.nombre}" style="width:100%; height:1200px; border:none; background:transparent;"></iframe>`;
}
