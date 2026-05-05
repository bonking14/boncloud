const incoterms = [
  {
    code: 'EXW',
    nombre: 'Ex Works',
    lugar: 'En fábrica del vendedor',
    tipo: ['multimodal', 'comprador'],
    desc: 'El vendedor pone la mercancía a disposición en sus instalaciones. El comprador asume absolutamente todos los costos y riesgos desde ese punto.',
    responsabilidades: {
      'Transporte origen': 'Comprador',
      'Aduana exportación': 'Comprador',
      'Flete internacional': 'Comprador',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'FCA',
    nombre: 'Free Carrier',
    lugar: 'Transportista designado por comprador',
    tipo: ['multimodal'],
    desc: 'El vendedor entrega la mercancía al transportista designado por el comprador en el lugar acordado. Muy flexible, sirve para contenedores.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Comprador',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'FAS',
    nombre: 'Free Alongside Ship',
    lugar: 'Al costado del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega la mercancía al costado del buque en el puerto de origen. Solo para transporte marítimo o fluvial.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Comprador',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'FOB',
    nombre: 'Free On Board',
    lugar: 'A bordo del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega la mercancía a bordo del buque en el puerto de origen. El riesgo pasa al comprador cuando la mercancía está en el buque. El más usado en Colombia.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Comprador',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'CFR',
    nombre: 'Cost and Freight',
    lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'El vendedor paga el flete hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía sube al buque. El comprador asume el seguro.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'CIF',
    nombre: 'Cost, Insurance and Freight',
    lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'El vendedor paga flete y seguro hasta el puerto de destino. Es la base de cálculo para los tributos aduaneros en Colombia.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Vendedor',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Comprador'
    }
  },
  {
    code: 'CPT',
    nombre: 'Carriage Paid To',
    lugar: 'Lugar de destino acordado',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor paga el transporte hasta el destino acordado. El riesgo pasa al comprador cuando se entrega al primer transportista.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Comprador',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Vendedor'
    }
  },
  {
    code: 'CIP',
    nombre: 'Carriage and Insurance Paid To',
    lugar: 'Lugar de destino acordado',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor paga transporte y seguro hasta el destino. En Incoterms 2020 el seguro debe ser de cobertura máxima (Instituto de Cargos A).',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Vendedor',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Vendedor'
    }
  },
  {
    code: 'DAP',
    nombre: 'Delivered At Place',
    lugar: 'Lugar de destino acordado',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor asume todos los costos y riesgos hasta el lugar de destino acordado, listo para descarga. El comprador asume aduana de importación.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Vendedor',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Vendedor'
    }
  },
  {
    code: 'DPU',
    nombre: 'Delivered at Place Unloaded',
    lugar: 'Terminal de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Único Incoterm donde el vendedor asume el costo de descarga en destino. El comprador solo asume aduana de importación y transporte interno.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Vendedor',
      'Aduana importación': 'Comprador',
      'Transporte destino': 'Vendedor'
    }
  },
  {
    code: 'DDP',
    nombre: 'Delivered Duty Paid',
    lugar: 'Destino final',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor asume absolutamente todo — incluyendo aranceles e impuestos de importación. Es el Incoterm de máxima responsabilidad para el vendedor.',
    responsabilidades: {
      'Transporte origen': 'Vendedor',
      'Aduana exportación': 'Vendedor',
      'Flete internacional': 'Vendedor',
      'Seguro': 'Vendedor',
      'Aduana importación': 'Vendedor',
      'Transporte destino': 'Vendedor'
    }
  }
];

const columnas = ['Transporte origen', 'Aduana exportación', 'Flete internacional', 'Seguro', 'Aduana importación', 'Transporte destino'];

function renderCards(filtro) {
  const grid = document.getElementById('incoterms-grid');
  grid.innerHTML = '';

  const filtrados = filtro === 'todos'
    ? incoterms
    : incoterms.filter(i => i.tipo.includes(filtro));

  filtrados.forEach(inc => {
    const tags = inc.tipo.map(t => `<span class="tag tag-${t}">${t}</span>`).join('');
    const resps = Object.entries(inc.responsabilidades).map(([k, v]) => {
      const cls = v === 'Vendedor' ? 'resp-vendedor' : v === 'Comprador' ? 'resp-comprador' : 'resp-ambos';
      return `<div class="resp-row"><span>${k}</span><span class="${cls}">${v}</span></div>`;
    }).join('');

    grid.innerHTML += `
      <div class="incoterm-card">
        <div class="incoterm-card-header">
          <div class="incoterm-code">${inc.code}</div>
          <div class="incoterm-name">
            <strong>${inc.nombre}</strong>
            ${inc.lugar}
          </div>
        </div>
        <p class="incoterm-desc">${inc.desc}</p>
        <div class="incoterm-tags">${tags}</div>
        <div class="responsabilidad">${resps}</div>
      </div>`;
  });
}

function renderTabla() {
  const tbody = document.getElementById('tabla-body');
  incoterms.forEach(inc => {
    const celdas = columnas.map(col => {
      const v = inc.responsabilidades[col];
      const cls = v === 'Vendedor' ? 'celda-v' : v === 'Comprador' ? 'celda-c' : 'celda-n';
      return `<td class="${cls}">${v}</td>`;
    }).join('');
    tbody.innerHTML += `<tr><td>${inc.code}</td>${celdas}</tr>`;
  });
}

// Filtros
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});

renderCards('todos');
renderTabla();