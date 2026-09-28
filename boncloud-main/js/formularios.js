const formularios = [
  { id: "001", nombre: "Formulario 001 - Registro Único Tributario (RUT)", tipo: "Requisito" },
  { id: "500", nombre: "Formulario 500 - Declaración de Importación", tipo: "Importación" },
  { id: "560", nombre: "Formulario 560 - Declaración Andina del Valor (DAV)", tipo: "Importación" },
  { id: "600", nombre: "Formulario 600 - Declaración de Exportación (DEX)", tipo: "Exportación" },
  { id: "DTA", nombre: "Formulario de Tránsito Aduanero (DTA)", tipo: "Tránsito" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Render initial grid
    renderGrid(formularios);

    // Búsqueda inteligente
    const buscador = document.getElementById('buscador-forms');
    buscador.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtrados = formularios.filter(f => 
            f.nombre.toLowerCase().includes(query) || 
            f.tipo.toLowerCase().includes(query) || 
            f.id.toLowerCase().includes(query)
        );
        renderGrid(filtrados);
    });

    // Botones de editor
    document.getElementById('btn-volver').addEventListener('click', () => {
        document.getElementById('vista-editor').style.display = 'none';
        document.getElementById('vista-dashboard').style.display = 'block';
    });

    // Botón de Limpieza Rápida
    document.getElementById('btn-limpiar').addEventListener('click', () => {
        const iframe = document.getElementById('form-iframe');
        if (iframe) {
            iframe.contentWindow.location.reload();
            return;
        }
        const inputs = document.querySelectorAll('#form-render-area input:not([readonly])');
        inputs.forEach(input => input.value = '');
        // Disparar cálculos automáticos para resetear a 0
        document.querySelectorAll('.calc-trigger').forEach(el => {
            el.dispatchEvent(new Event('input'));
        });
    });

    // Exportar PDF
    document.getElementById('btn-descargar').addEventListener('click', () => {
        const iframe = document.getElementById('form-iframe');
        if (iframe) {
            if (iframe.contentWindow && iframe.contentWindow.validateAndPrint) {
                iframe.contentWindow.validateAndPrint();
            } else {
                iframe.contentWindow.print();
            }
            return;
        }
        const element = document.getElementById('form-render-area');
        const opt = {
            margin:       0.5,
            filename:     'formulario_dian.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });
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
        div.innerHTML = `
            <h3>${form.nombre}</h3>
            <span class="tag-tipo">${form.tipo}</span>
        `;
        div.addEventListener('click', () => openFormEditor(form.id));
        grid.appendChild(div);
    });
}

function openFormEditor(id) {
    document.getElementById('vista-dashboard').style.display = 'none';
    document.getElementById('vista-editor').style.display = 'block';
    const renderArea = document.getElementById('form-render-area');
    
    if (["001", "500", "560", "600", "DTA"].includes(id)) {
        let file = "";
        if (id === "001") file = "form-001-rut.html";
        if (id === "500") file = "form-500-importacion.html";
        if (id === "560") file = "form-560-dav.html";
        if (id === "600") file = "form-600-exportacion.html";
        if (id === "DTA") file = "form-dta-transito.html";
        
        renderArea.innerHTML = `<iframe id="form-iframe" src="formularios/${file}" style="width:100%; height:1200px; border:none; background:transparent; overflow:hidden;"></iframe>`;
        return;
    }

    
    if (id === "500") {
        renderArea.innerHTML = getForm500HTML();
        setupForm500Logic();
    } else if (id === "SIM") {
        renderArea.innerHTML = getSimuladorHTML();
        setupSimuladorLogic();
    } else {
        renderArea.innerHTML = `
            <div style="padding:40px; text-align:center;">
                <h3>Formulario ${id}</h3>
                <p>Este formulario estará disponible próximamente.</p>
            </div>
        `;
    }
}

function getForm500HTML() {
    return `
    <div id="form-500-doc">
      <div class="dian-header">
        <div class="dian-logo-sec">DIAN</div>
        <div class="dian-title-sec">
          <p>República de Colombia</p>
          <h2>Declaración de Importación</h2>
        </div>
        <div class="dian-num-sec">
          <p>Privada</p>
          <span>500</span>
        </div>
      </div>

      <div class="seccion-dian">
        <div class="seccion-titulo">1. Datos del Importador</div>
        <div class="seccion-body">
          <div class="casilla-dian size-20">
            <label class="numero-casilla">27</label>
            <span class="titulo-casilla">NIT</span>
            <input type="number" id="f500-nit" placeholder="Ej. 901234567" class="input-dian-libre">
          </div>
          <div class="casilla-dian size-10">
            <label class="numero-casilla">28</label>
            <span class="titulo-casilla">DV</span>
            <input type="number" id="f500-dv" max="9" class="input-dian-libre text-center">
          </div>
          <div class="casilla-dian size-70 no-border-right">
            <label class="numero-casilla">29</label>
            <span class="titulo-casilla">Primer apellido o Razón Social</span>
            <input type="text" id="f500-razon" placeholder="EMPRESA S.A.S." class="input-dian-libre">
          </div>
        </div>
      </div>

      <div class="seccion-dian">
        <div class="seccion-titulo">2. Liquidación (Cálculo Automático)</div>
        <div class="seccion-body">
          <div class="casilla-dian size-50">
            <label class="numero-casilla">69</label>
            <span class="titulo-casilla">Base Gravable Arancel (USD)</span>
            <input type="number" id="f500-base-arancel" placeholder="0" class="input-dian-libre calc-trigger">
          </div>
          <div class="casilla-dian size-50 no-border-right">
            <label class="numero-casilla">70</label>
            <span class="titulo-casilla">% Arancel</span>
            <input type="number" id="f500-tasa-arancel" placeholder="0" class="input-dian-libre calc-trigger">
          </div>
          <div class="casilla-dian size-100 no-border-right">
            <label class="numero-casilla">83</label>
            <span class="titulo-casilla">Total Arancel a Pagar (USD)</span>
            <input type="number" id="f500-total-arancel" class="input-dian-libre" readonly>
          </div>
          
          <div class="casilla-dian size-50 no-border-bottom">
            <label class="numero-casilla">84</label>
            <span class="titulo-casilla">Base Gravable IVA (USD)</span>
            <input type="number" id="f500-base-iva" placeholder="0" class="input-dian-libre calc-trigger">
          </div>
          <div class="casilla-dian size-50 no-border-right no-border-bottom">
            <label class="numero-casilla">85</label>
            <span class="titulo-casilla">% IVA</span>
            <input type="number" id="f500-tasa-iva" placeholder="0" class="input-dian-libre calc-trigger">
          </div>
          <div class="casilla-dian size-100 no-border-right no-border-bottom">
            <label class="numero-casilla">86</label>
            <span class="titulo-casilla">Total IVA a Pagar (USD)</span>
            <input type="number" id="f500-total-iva" class="input-dian-libre" readonly>
          </div>
        </div>
      </div>
    </div>
    `;
}

function setupForm500Logic() {
    const triggers = document.querySelectorAll('.calc-trigger');
    triggers.forEach(t => t.addEventListener('input', () => {
        // Cálculo Arancel
        const baseArancel = parseFloat(document.getElementById('f500-base-arancel').value) || 0;
        const tasaArancel = parseFloat(document.getElementById('f500-tasa-arancel').value) || 0;
        const totalArancel = (baseArancel * tasaArancel) / 100;
        document.getElementById('f500-total-arancel').value = totalArancel ? totalArancel.toFixed(2) : '';

        // Cálculo IVA
        const baseIva = parseFloat(document.getElementById('f500-base-iva').value) || 0;
        const tasaIva = parseFloat(document.getElementById('f500-tasa-iva').value) || 0;
        const totalIva = (baseIva * tasaIva) / 100;
        document.getElementById('f500-total-iva').value = totalIva ? totalIva.toFixed(2) : '';
    }));
}
