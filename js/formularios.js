const formularios = [
  { id: "001", nombre: "Formulario 001 - Registro Único Tributario (RUT)", tipo: "Requisito" },
  { id: "500", nombre: "Formulario 500 - Declaración de Importación", tipo: "Importación" },
  { id: "560", nombre: "Formulario 560 - Declaración Andina del Valor (DAV)", tipo: "Importación" },
  { id: "600", nombre: "Formulario 600 - Declaración de Exportación (DEX)", tipo: "Exportación" },
  { id: "DTA", nombre: "Formulario de Tránsito Aduanero (DTA)", tipo: "Tránsito" },
  { id: "SIM", nombre: "Simulador de Importaciones IA", tipo: "Simulación" }
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
    
    if (["001", "500", "600", "DTA"].includes(id)) {
        let file = "";
        if (id === "001") file = "form-001-rut.html";
        if (id === "500") file = "form-500-importacion.html";
        if (id === "600") file = "form-600-exportacion.html";
        if (id === "DTA") file = "form-dta-transito.html";
        
        renderArea.innerHTML = `<iframe id="form-iframe" src="formularios/${file}" style="width:100%; height:1200px; border:none; background:transparent; overflow:hidden;"></iframe>`;
        return;
    }

    
    if (id === "500") {
        renderArea.innerHTML = getForm500HTML();
        setupForm500Logic();
    } else if (id === "560") {
        renderArea.innerHTML = getForm560HTML();
        setupForm560Logic();
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

function getForm560HTML() {
    return `
<style>
/* ===== BASE 560 ===== */
.form-560-wrapper {
  font-family: Arial, 'Arial Narrow', sans-serif;
  font-size: 10px;
  color: #000;
  background: transparent;
  line-height: 1.2;
}
.form-560-wrapper * {
  box-sizing: border-box;
}

/* ===== PAPER ===== */
.form-560-wrapper .paper-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 16px 48px;
}
.form-560-wrapper .paper {
  background: #fff;
  width: 794px;
  min-height: 1123px;
  box-shadow: 0 4px 32px rgba(0,0,0,.35);
  border: 1px solid #bbb;
  padding: 0;
  position: relative;
  font-family: Arial, sans-serif;
}

/* ===== FORM GLOBAL ===== */
.form-560-wrapper .form-560 {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .form-560 td, .form-560-wrapper .form-560 th {
  border: 1px solid #1a3a6b;
  padding: 2px 3px;
  vertical-align: top;
  font-size: 9px;
  font-family: Arial, sans-serif;
}

/* ===== CELL LABEL ===== */
.form-560-wrapper .cl {
  font-size: 7.5px;
  color: #1a3a6b;
  line-height: 1.3;
  display: block;
  margin-bottom: 1px;
  font-family: Arial, sans-serif;
  font-weight: 500;
}
.form-560-wrapper .cl-num {
  font-size: 7px;
  color: #1a3a6b;
  font-style: normal;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

/* ===== EDITABLE INPUTS ===== */
.form-560-wrapper input[type="text"], .form-560-wrapper input[type="number"], .form-560-wrapper input[type="date"], .form-560-wrapper select, .form-560-wrapper textarea {
  border: none;
  border-bottom: 1px solid transparent;
  background: transparent;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 9px;
  color: #000;
  padding: 1px 2px;
  outline: none;
  transition: background .1s;
  font-weight: normal;
}
.form-560-wrapper input[type="text"]:focus, .form-560-wrapper input[type="number"]:focus, .form-560-wrapper input[type="date"]:focus, .form-560-wrapper select:focus, .form-560-wrapper textarea:focus {
  background: #ffffcc;
  border-bottom-color: #1a3a6b;
}
.form-560-wrapper input.yn {
  width: 25px;
  text-align: center;
  font-weight: bold;
  font-size: 8px;
}
.form-560-wrapper input.small { width: 45px; }
.form-560-wrapper input.medium { width: 75px; }
.form-560-wrapper select { font-size: 8px; }

/* ===== HEADER SECTION ===== */
.form-560-wrapper .hdr-dian {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 2px solid #1a3a6b;
  background: #fff;
}
.form-560-wrapper .dian-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6px 8px;
  border-right: 2px solid #1a3a6b;
  width: 80px;
}
.form-560-wrapper .dian-logo-box {
  font-size: 22px;
  font-weight: 700;
  color: #2db0d6;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  line-height: 1.1;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .dian-logo-box span {
  font-weight: 700;
  color: #6bb96a;
  font-size: 14px;
}
.form-560-wrapper .dian-sub {
  font-size: 5.5px;
  color: #333;
  line-height: 1.1;
  letter-spacing: 0.3px;
  margin-top: 1px;
  font-weight: 600;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .hdr-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.form-560-wrapper .hdr-title {
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  color: #000;
  padding: 6px 8px 4px;
  font-family: Arial, sans-serif;
  letter-spacing: 0.5px;
}
.form-560-wrapper .nota-lea {
  font-size: 7px;
  color: #000;
  text-align: center;
  padding: 3px;
  border-bottom: 1px solid #1a3a6b;
  font-weight: 600;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .big-num {
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  line-height: 0.9;
  background: #5078b5;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid #1a3a6b;
  font-family: Arial, sans-serif;
}

/* ===== SECTION HEADERS (vertical labels) ===== */
.form-560-wrapper .sec-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 8px;
  font-weight: 700;
  text-align: center;
  padding: 4px 2px;
  color: #000;
  font-family: Arial, sans-serif;
  letter-spacing: 0.5px;
}

/* ===== DESCRIPTION TABLE ===== */
.form-560-wrapper .desc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .desc-table th {
  border: 1px solid #1a3a6b;
  padding: 2px 3px;
  font-size: 8px;
  text-align: left;
  font-weight: 600;
  color: #000;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .desc-table td {
  border: 1px solid #1a3a6b;
  padding: 1px 2px;
  vertical-align: middle;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .desc-table input[type="text"], .form-560-wrapper .desc-table input[type="number"] {
  width: 100%;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .row-num {
  text-align: center;
  font-size: 8px;
  color: #000;
  padding: 2px 4px;
  width: 18px;
  font-family: Arial, sans-serif;
  font-weight: 600;
}

/* ===== VALOR TABLE ===== */
.form-560-wrapper .valor-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .valor-table td {
  border: 1px solid #1a3a6b;
  padding: 2px 3px;
  vertical-align: middle;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .valor-table .v-label {
  font-size: 8px;
  line-height: 1.3;
  padding: 2px 3px;
  color: #000;
  font-family: Arial, sans-serif;
  font-weight: 500;
}
.form-560-wrapper .valor-table .v-col-head {
  font-size: 7.5px;
  font-weight: 700;
  text-align: center;
  color: #000;
  padding: 2px;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .valor-table .v-total {
  font-weight: 700;
  font-size: 8px;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .casilla-num {
  font-size: 7px;
  color: #000;
  font-weight: bold;
  display: inline-block;
  margin-right: 4px;
  font-family: Arial, sans-serif;
}


/* FIRMA */
.form-560-wrapper .firma-row {
  border-top: 2px solid #1a3a6b;
  padding: 4px 0;
  font-size: 8px;
  font-family: Arial, sans-serif;
}
.form-560-wrapper .firma-line {
  border-top: 1px solid #1a3a6b;
  margin-top: 14px;
  padding-top: 2px;
  font-size: 7px;
  color: #000;
  font-family: Arial, sans-serif;
  font-weight: 500;
}

/* ===== PRINT ===== */
@media print {
  .form-560-wrapper .paper { box-shadow: none; border: none; width: 100%; }
  .form-560-wrapper input, .form-560-wrapper select, .form-560-wrapper textarea { border-bottom: none !important; background: transparent !important; }
}
.form-560-wrapper .page-break { page-break-before: always; border-top: 3px dashed #aaa; margin-top: 20px; }
.form-560-wrapper .paper.p2 { margin-top: 30px; }
</style>
<div class="form-560-wrapper">
  <!-- ========== HOJA 1 ========== -->
  <div class="paper-wrap">
    <div class="paper" id="hoja1">

      <!-- CABECERA -->
      <div class="hdr-dian">
        <div class="dian-brand">
          <div class="dian-logo-box">DIAN<span>&reg;</span></div>
          <div class="dian-sub">POR UNA COLOMBIA MÁS HONESTA</div>
        </div>
        <div class="hdr-center">
          <div class="hdr-title">Declaración Andina del Valor</div>
          <div style="display:flex; border-bottom: 1px solid #1a3a6b;">
             <div style="padding: 2px 4px; border-right: 1px solid #1a3a6b;">
                <span class="cl"><span class="cl-num">1.</span> Año</span>
                <input type="text" style="width:50px" placeholder="AAAA" id="f-anio">
             </div>
             <div style="padding: 2px 4px; flex: 1;">
                <span class="cl"><span class="cl-num">4.</span> Número de formulario</span>
                <input type="text" style="width:100%" id="f-numform" placeholder="N° único DAV">
             </div>
          </div>
          <div class="nota-lea">Lea cuidadosamente las instrucciones</div>
        </div>
        <div class="big-num">560</div>
      </div>

      <!-- IMPORTADOR -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="2" style="width:20px">Importador</td>
          <td colspan="5">
            <span class="cl"><span class="cl-num">5.</span> Número de Identificación Tributaria (NIT)</span>
            <input type="text" id="f-nit" placeholder="NIT sin puntos">
          </td>
          <td style="width:30px">
            <span class="cl"><span class="cl-num">6.</span> DV.</span>
            <input type="text" id="f-dv" class="small" placeholder="0">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">7.</span> Primer apellido</span>
            <input type="text" id="f-ap1">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">8.</span> Segundo apellido</span>
            <input type="text" id="f-ap2">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">9.</span> Primer nombre</span>
            <input type="text" id="f-nom1">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">10.</span> Otros nombres</span>
            <input type="text" id="f-nom2">
          </td>
        </tr>
        <tr>
          <td colspan="14">
            <span class="cl"><span class="cl-num">11.</span> Razón social</span>
            <input type="text" id="f-razon" placeholder="Nombre empresa o persona jurídica">
          </td>
        </tr>
      </table>

      <!-- DATOS GENERALES -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="6" style="width:20px">Datos generales</td>
          <td style="width:80px">
            <span class="cl"><span class="cl-num">24.</span> Cód. Dirección seccional</span>
            <input type="text" id="f-dirsec" placeholder="Cód.">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">25.</span> No. Declaración de importación</span>
            <input type="text" id="f-noimpo" placeholder="N° aceptación Form. 500 casilla 132">
          </td>
          <td colspan="3">
            <span class="cl"><span class="cl-num">26.</span> Fecha <small>(AAAA MM DD)</small></span>
            <input type="date" id="f-fecha26">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">27.</span> Tipo declaración de importación</span>
            <select id="f-tipodec">
              <option value="">Seleccionar...</option>
              <option value="1">1 – Inicial</option>
              <option value="2">2 – Legalización</option>
              <option value="3">3 – Anticipada</option>
              <option value="4">4 – Corrección</option>
              <option value="5">5 – Modificación</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <span class="cl"><span class="cl-num">28.</span> Cód. Nivel comercial comprador</span>
            <select id="f-nivel">
              <option value="">-</option>
              <option value="1">1 – Mayorista</option>
              <option value="2">2 – Minorista</option>
              <option value="3">3 – Usuario</option>
              <option value="4">4 – Otro</option>
            </select>
          </td>
          <td colspan="7">
            <span class="cl"><span class="cl-num">29.</span> Especifique (si cód. 28 = 4)</span>
            <input type="text" id="f-espec29">
          </td>
        </tr>
        <tr>
          <td>
            <span class="cl"><span class="cl-num">30.</span> Cód. Condición Vendedor</span>
            <select id="f-condvend">
              <option value="">-</option>
              <option value="1">1 – Fabricante</option>
              <option value="2">2 – Distribuidor</option>
              <option value="3">3 – Otro</option>
            </select>
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">31.</span> Especifique Vendedor</span>
            <input type="text" id="f-espec31">
          </td>
          <td>
            <span class="cl"><span class="cl-num">32.</span> Resolución No.</span>
            <input type="text" id="f-resol32">
          </td>
          <td colspan="4">
            <span class="cl"><span class="cl-num">33.</span> Fecha <small>(AAAA MM DD)</small></span>
            <input type="date" id="f-fecha33">
          </td>
        </tr>
        <tr>
          <td>
            <span class="cl"><span class="cl-num">34.</span> Cód. Tipo resolución</span>
            <select id="f-tiporesol">
              <option value="">-</option>
              <option value="1">1 – Ajuste permanente</option>
              <option value="2">2 – Anticipada</option>
            </select>
          </td>
          <td>
            <span class="cl"><span class="cl-num">35.</span> Cód. Naturaleza transacción</span>
            <select id="f-nattrans">
              <option value="">-</option>
              <option value="11">11 – Compraventa precio firme</option>
              <option value="12">12 – Compraventa precio revisable</option>
              <option value="13">13 – Uso exterior y posterior exp.</option>
              <option value="14">14 – Suministros gratuitos</option>
              <option value="15">15 – Reparación o transformación</option>
              <option value="16">16 – Sucursales</option>
              <option value="17">17 – Consignación</option>
              <option value="18">18 – Intercambio compensado</option>
              <option value="19">19 – Leasing</option>
              <option value="20">20 – Alquiler simple</option>
              <option value="21">21 – Sustitución devueltas</option>
              <option value="22">22 – Sustitución no devueltas</option>
              <option value="28">28 – Préstamo/Comodato</option>
              <option value="29">29 – Otras transacciones</option>
            </select>
          </td>
          <td>
            <span class="cl"><span class="cl-num">36.</span> Cód. Forma envío</span>
            <select id="f-formaenv">
              <option value="">-</option>
              <option value="1">1 – Envío único / valor total</option>
              <option value="2">2 – Envío único / valor fraccionado</option>
              <option value="3">3 – Envío fraccionado / valor total</option>
              <option value="4">4 – Envío fraccionado / valor fraccionado</option>
            </select>
          </td>
          <td>
            <span class="cl"><span class="cl-num">37.</span> Condiciones de entrega</span>
            <select id="f-incoterm">
              <option value="">-</option>
              <option>EXW – En Fábrica</option>
              <option>FCA – Franco Transportista</option>
              <option>FAS – Franco Costado Buque</option>
              <option>FOB – Franco a Bordo</option>
              <option>CFR – Coste y Flete</option>
              <option>CIF – Coste, Seguro y Flete</option>
              <option>CPT – Transporte Pagado hasta</option>
              <option>CIP – Transporte y Seguro Pagados</option>
              <option>DAT – Entregada en Terminal</option>
              <option>DAP – Entregada en Lugar</option>
              <option>DDP – Entregada Derechos Pagados</option>
            </select>
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">38.</span> Lugar</span>
            <input type="text" id="f-lugar38" placeholder="Ciudad/Puerto/Aeropuerto">
          </td>
          <td>
            <span class="cl"><span class="cl-num">39.</span> Cód. País procedencia</span>
            <input type="text" id="f-paisprocedencia" placeholder="Ej: CO, US, CN">
          </td>
        </tr>
        <tr>
          <td>
            <span class="cl"><span class="cl-num">40.</span> Factura No.</span>
            <input type="text" id="f-factura40">
          </td>
          <td>
            <span class="cl"><span class="cl-num">41.</span> Fecha</span>
            <input type="date" id="f-fecha41">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">42.</span> Tipo contrato o documento</span>
            <select id="f-tipocontrato">
              <option value="">Seleccionar...</option>
              <option>Compraventa</option>
              <option>Leasing</option>
              <option>Reversiones</option>
              <option>Comisión de compra</option>
              <option>Comisión de venta/Corretaje</option>
              <option>Cánones y derechos de licencia</option>
              <option>Consignación</option>
              <option>Otro contrato o documento</option>
            </select>
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">43.</span> Número contrato u otro documento</span>
            <input type="text" id="f-numcontrato">
          </td>
          <td>
            <span class="cl"><span class="cl-num">44.</span> Fecha</span>
            <input type="date" id="f-fecha44">
          </td>
          <td>
            <span class="cl"><span class="cl-num">45.</span> Valor contrato</span>
            <input type="number" id="f-valcontrato" placeholder="0.00">
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <span class="cl"><span class="cl-num">46.</span> Valor FOB total (moneda negociación)</span>
            <input type="number" id="f-fob46" placeholder="0.00" style="width:120px">
          </td>
        </tr>
        <!-- MONEDAS / CAMBIO -->
        <tr>
          <td colspan="9" style="padding:0">
            <table style="width:100%;border-collapse:collapse;font-size:8px">
              <tr>
                <td style="width:33%; border:none; border-right:1px solid #1a3a6b; padding:1px 3px;">
                  <span class="cl"><span class="cl-num">47.</span> Cód. Moneda</span>
                  <select id="f-mon47" style="font-size:7.5px; width:40px; display:inline-block;">
                    <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option><option>COP</option>
                  </select>
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">48.</span> Tipo de cambio</span> <input type="number" style="width:55px; display:inline-block;" id="f-tc48" placeholder="1.00">
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">49.</span> Fecha</span> <input type="date" id="f-fecha49" style="width:90px; display:inline-block;">
                </td>
                <td style="width:33%; border:none; border-right:1px solid #1a3a6b; padding:1px 3px;">
                  <span class="cl"><span class="cl-num">50.</span> Cód. Moneda</span>
                  <select id="f-mon50" style="font-size:7.5px; width:40px; display:inline-block;">
                    <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option>
                  </select>
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">51.</span> Tipo de cambio</span> <input type="number" style="width:55px; display:inline-block;" id="f-tc51" placeholder="1.00">
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">52.</span> Fecha</span> <input type="date" id="f-fecha52" style="width:90px; display:inline-block;">
                </td>
                <td style="width:34%; border:none; padding:1px 3px;">
                  <span class="cl"><span class="cl-num">53.</span> Cód. Moneda</span>
                  <select id="f-mon53" style="font-size:7.5px; width:40px; display:inline-block;">
                    <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option>
                  </select>
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">54.</span> Tipo de cambio</span> <input type="number" style="width:55px; display:inline-block;" id="f-tc54" placeholder="1.00">
                  &nbsp;<span class="cl" style="display:inline;"><span class="cl-num">55.</span> Fecha</span> <input type="date" id="f-fecha55" style="width:90px; display:inline-block;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- INTERMEDIACIÓN -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="3" style="width:20px">Intermediación</td>
          <td style="width:60px">
            <span class="cl"><span class="cl-num">56.</span> Existe intermediación?</span>
            <input type="text" class="yn" id="f-intermed" placeholder="S/N">
          </td>
          <td style="width:80px">
            <span class="cl"><span class="cl-num">57.</span> Cód. Tipo intermediario</span>
            <select id="f-tipointerm">
              <option value="">-</option>
              <option value="1">1 – Agente venta</option>
              <option value="2">2 – Agente compra</option>
              <option value="3">3 – Broker</option>
              <option value="4">4 – Otros</option>
            </select>
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">58.</span> Especifique (si cód. 57 = 4)</span>
            <input type="text" id="f-espec58">
          </td>
          <td>
            <span class="cl"><span class="cl-num">59.</span> Primer apellido</span>
            <input type="text" id="f-iap1">
          </td>
          <td>
            <span class="cl"><span class="cl-num">60.</span> Segundo apellido</span>
            <input type="text" id="f-iap2">
          </td>
          <td>
            <span class="cl"><span class="cl-num">61.</span> Primer nombre</span>
            <input type="text" id="f-inom1">
          </td>
          <td>
            <span class="cl"><span class="cl-num">62.</span> Otros nombres</span>
            <input type="text" id="f-inom2">
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <span class="cl"><span class="cl-num">63.</span> Razón social</span>
            <input type="text" id="f-irazon">
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">64.</span> Dirección</span>
            <input type="text" id="f-idir">
          </td>
          <td>
            <span class="cl"><span class="cl-num">65.</span> Ciudad</span>
            <input type="text" id="f-iciudad">
          </td>
          <td>
            <span class="cl"><span class="cl-num">66.</span> Cód. País</span>
            <input type="text" id="f-ipais" class="small">
          </td>
        </tr>
      </table>

      <!-- DESCRIPCIÓN MERCANCÍA - TABLA A (67-71) -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="8" style="width:20px">Descripción de la mercancía</td>
          <td colspan="8" style="padding:0">
            <table class="desc-table" style="border-style: hidden;">
              <thead>
                <tr>
                  <th style="width:20px; text-align:center;">Ítem</th>
                  <th><span class="cl"><span class="cl-num">67.</span> Nombre comercial</span></th>
                  <th><span class="cl"><span class="cl-num">68.</span> Marca comercial</span></th>
                  <th style="width:60px"><span class="cl"><span class="cl-num">69.</span> Tipo</span></th>
                  <th style="width:70px"><span class="cl"><span class="cl-num">70.</span> Clase</span></th>
                  <th style="width:60px"><span class="cl"><span class="cl-num">71.</span> Modelo</span></th>
                </tr>
              </thead>
              <tbody id="desc-a-body">
                <tr><td class="row-num">1</td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr>
                <tr><td class="row-num">2</td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr>
                <tr><td class="row-num">3</td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr>
              </tbody>
            </table>
          </td>
        </tr>
        <!-- TABLA B (72-78) -->
        <tr>
          <td colspan="8" style="padding:0">
            <table class="desc-table" style="border-style: hidden;">
              <thead>
                <tr>
                  <th style="width:20px; text-align:center;">Ítem</th>
                  <th style="width:80px"><span class="cl"><span class="cl-num">72.</span> Referencia</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">73.</span> Cód.<br>Estado</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">74.</span> Año<br>fabricación</span></th>
                  <th><span class="cl"><span class="cl-num">75.</span> Otras características</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">76.</span> Cantidad</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">77.</span> Unid.<br>Cial.</span></th>
                  <th style="width:80px"><span class="cl"><span class="cl-num">78.</span> Precio FOB<br>unitario USD</span></th>
                </tr>
              </thead>
              <tbody id="desc-b-body">
                <tr>
                  <td class="row-num">1</td>
                  <td><input type="text"></td>
                  <td>
                    <select style="font-size:7px;width:100%">
                      <option value="">-</option>
                      <option value="1">1-Nuevo</option><option value="2">2-Usado</option>
                      <option value="3">3-Desarmado</option><option value="7">7-Reconstruido</option>
                      <option value="8">8-Reacondicionado</option><option value="9">9-Remanufacturado</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="AAAA"></td>
                  <td><input type="text"></td>
                  <td><input type="number" placeholder="0"></td>
                  <td><input type="text" placeholder="KG/UN"></td>
                  <td><input type="number" placeholder="0.00" class="fob-unit form-560-calc"></td>
                </tr>
                <tr>
                  <td class="row-num">2</td>
                  <td><input type="text"></td>
                  <td><select style="font-size:7px;width:100%"><option value="">-</option><option value="1">1-Nuevo</option><option value="2">2-Usado</option></select></td>
                  <td><input type="text" placeholder="AAAA"></td>
                  <td><input type="text"></td>
                  <td><input type="number" placeholder="0"></td>
                  <td><input type="text" placeholder="KG/UN"></td>
                  <td><input type="number" placeholder="0.00" class="fob-unit form-560-calc"></td>
                </tr>
                <tr>
                  <td class="row-num">3</td>
                  <td><input type="text"></td>
                  <td><select style="font-size:7px;width:100%"><option value="">-</option><option value="1">1-Nuevo</option><option value="2">2-Usado</option></select></td>
                  <td><input type="text" placeholder="AAAA"></td>
                  <td><input type="text"></td>
                  <td><input type="number" placeholder="0"></td>
                  <td><input type="text" placeholder="KG/UN"></td>
                  <td><input type="number" placeholder="0.00" class="fob-unit form-560-calc"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>

      <!-- REQUISITOS -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="2" style="width:20px">Requisitos</td>
          <td style="width:70px">
            <span class="cl"><span class="cl-num">79.</span> Existen<br>restricciones?</span>
            <input type="text" class="yn" id="f-r79" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">80.</span> Cód. Tipo<br>restricción</span>
            <select id="f-r80" style="font-size:7.5px">
              <option value="">-</option>
              <option value="01">01 – Impuestas por ley</option>
              <option value="02">02 – Limitan territorio reventa</option>
              <option value="03">03 – No afectan valor</option>
              <option value="04">04 – Otro tipo</option>
            </select>
          </td>
          <td>
            <span class="cl"><span class="cl-num">81.</span> Existen condiciones o<br>contraprestaciones?</span>
            <input type="text" class="yn" id="f-r81" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">82.</span> Cód. Tipo condición<br>o contraprestación</span>
            <select id="f-r82" style="font-size:7.5px">
              <option value="">-</option>
              <option value="01">01 – Precio depende otras mercancías</option>
              <option value="02">02 – Precio depende venta otras mercs.</option>
              <option value="03">03 – Precio depende forma pago ajena</option>
              <option value="04">04 – Descuentos por cantidades/pago</option>
              <option value="05">05 – Venta depende comercialización</option>
              <option value="06">06 – Pagos indirectos beneficio vendedor</option>
              <option value="07">07 – Prestaciones para producción</option>
              <option value="08">08 – Pagos por derechos PI</option>
              <option value="09">09 – Otra condición</option>
            </select>
          </td>
          <td colspan="2">
            <span class="cl"><span class="cl-num">83.</span> Especifique (si cód. 82 = 09)</span>
            <input type="text" id="f-r83">
          </td>
          <td>
            <span class="cl"><span class="cl-num">84.</span> Puede<br>determinarse?</span>
            <input type="text" class="yn" id="f-r84" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">85.</span> Existen cánones y<br>derechos de licencia?</span>
            <input type="text" class="yn" id="f-r85" placeholder="S/N">
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <span class="cl"><span class="cl-num">86.</span> Existen reversiones al<br>vendedor?</span>
            <input type="text" class="yn" id="f-r86" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">87.</span> Existe vinculación entre<br>comprador y vendedor?</span>
            <input type="text" class="yn" id="f-r87" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">88.</span> Cód. Tipo<br>vinculación</span>
            <select id="f-r88" style="font-size:7.5px">
              <option value="">-</option>
              <option value="1">1 – Cargos dirección</option>
              <option value="2">2 – Asociadas en negocios</option>
              <option value="3">3 – Empleador-empleado</option>
              <option value="4">4 – ≥5% acciones</option>
              <option value="5">5 – Control directo/indirecto</option>
              <option value="6">6 – Controladas por tercero</option>
              <option value="7">7 – Controlan a tercero</option>
              <option value="8">8 – Familia</option>
            </select>
          </td>
          <td>
            <span class="cl"><span class="cl-num">89.</span> Influye la vinculación<br>en el precio?</span>
            <input type="text" class="yn" id="f-r89" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">90.</span> Existen<br>valores criterio?</span>
            <input type="text" class="yn" id="f-r90" placeholder="S/N">
          </td>
          <td>
            <span class="cl"><span class="cl-num">91.</span> Declaración de importación No.</span>
            <input type="text" id="f-r91">
          </td>
          <td>
            <span class="cl"><span class="cl-num">92.</span> Fecha</span>
            <input type="date" id="f-r92">
          </td>
        </tr>
      </table>

      <!-- DETERMINACIÓN DEL VALOR -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="20" style="width:20px">Determinación del valor en aduana</td>
          <td colspan="6" style="padding:0">
            <table class="valor-table">
              <thead>
                <tr>
                  <td style="width:40%;font-size:8px;font-weight:700;padding:3px;color:#000; text-align:center;">Determinación del valor</td>
                  <td class="v-col-head" style="width:22%">Valor moneda de<br>facturación distinta<br>al dólar</td>
                  <td class="v-col-head" style="width:13%">USD</td>
                  <td style="width:40%;font-size:8px;font-weight:700;padding:3px;color:#000; text-align:center;">Determinación del valor</td>
                  <td class="v-col-head" style="width:22%">Valor moneda de<br>facturación distinta<br>al dólar</td>
                  <td class="v-col-head" style="width:13%">USD</td>
                </tr>
              </thead>
              <tbody>
                <!-- Fila 93/94 — 115/116 -->
                <tr>
                  <td class="v-label">Precio neto según factura <span class="casilla-num" style="float:right;">93</span></td>
                  <td><input type="number" id="v93" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">94</span><input type="number" id="v94" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Gastos de transporte, manejo y entrega en el exterior<br>hasta el lugar de embarque <span class="casilla-num" style="float:right;">115</span></td>
                  <td><input type="number" id="v115" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">116</span><input type="number" id="v116" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 95/96 — 117/118 -->
                <tr>
                  <td class="v-label">Pagos indirectos, descuentos retroactivos u otros <span class="casilla-num" style="float:right;">95</span></td>
                  <td><input type="number" id="v95" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">96</span><input type="number" id="v96" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Gastos de transporte desde el lugar de embarque<br>hasta el lugar de importación <span class="casilla-num" style="float:right;">117</span></td>
                  <td><input type="number" id="v117" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">118</span><input type="number" id="v118" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 97 — 119/120 -->
                <tr>
                  <td class="v-label v-total"><b>Precio pagado o por pagar</b></td>
                  <td></td>
                  <td><span class="casilla-num">97</span><input type="number" id="v97" placeholder="0.00" style="font-weight:700; width: calc(100% - 15px);" readonly></td>
                  <td class="v-label">Gastos de carga, descarga y manipulación <span class="casilla-num" style="float:right;">119</span></td>
                  <td><input type="number" id="v119" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">120</span><input type="number" id="v120" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 98/99 -->
                <tr>
                  <td class="v-label">Comisiones, corretajes, excepto las comisiones de<br>compra <span class="casilla-num" style="float:right;">98</span></td>
                  <td><input type="number" id="v98" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">99</span><input type="number" id="v99" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Seguro <span class="casilla-num" style="float:right;">121</span></td>
                  <td><input type="number" id="v121" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">122</span><input type="number" id="v122" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 100/101 -->
                <tr>
                  <td class="v-label">Envases y embalajes <span class="casilla-num" style="float:right;">100</span></td>
                  <td><input type="number" id="v100" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">101</span><input type="number" id="v101" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label v-total"><b>Total adiciones</b></td>
                  <td style="background:#e8ecf5;"></td>
                  <td><span class="casilla-num">123</span><input type="number" id="v123" placeholder="0.00" style="font-weight:700; width: calc(100% - 15px);" readonly></td>
                </tr>
                <!-- 102/103 -->
                <tr>
                  <td class="v-label">Prestaciones en materias primas y otros <span class="casilla-num" style="float:right;">102</span></td>
                  <td><input type="number" id="v102" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">103</span><input type="number" id="v103" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Gastos de entrega posteriores a la importación <span class="casilla-num" style="float:right;">124</span></td>
                  <td><input type="number" id="v124" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">125</span><input type="number" id="v125" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 104/105 -->
                <tr>
                  <td class="v-label">Prestaciones en herramientas, matrices,<br>moldes, etc. <span class="casilla-num" style="float:right;">104</span></td>
                  <td><input type="number" id="v104" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">105</span><input type="number" id="v105" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Gastos de construcción, armado, instalación,<br>montaje, mantenimiento y asistencia técnica,<br>realizados después de la importación. <span class="casilla-num" style="float:right;">126</span></td>
                  <td><input type="number" id="v126" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">127</span><input type="number" id="v127" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 106/107 -->
                <tr>
                  <td class="v-label">Prestaciones en insumos y otros <span class="casilla-num" style="float:right;">106</span></td>
                  <td><input type="number" id="v106" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">107</span><input type="number" id="v107" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Derechos de aduana y otros impuestos <span class="casilla-num" style="float:right;">128</span></td>
                  <td><input type="number" id="v128" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">129</span><input type="number" id="v129" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 108/109 -->
                <tr>
                  <td class="v-label">Prestaciones en ingeniería, creación, planos, otros <span class="casilla-num" style="float:right;">108</span></td>
                  <td><input type="number" id="v108" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">109</span><input type="number" id="v109" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Intereses <span class="casilla-num" style="float:right;">130</span></td>
                  <td><input type="number" id="v130" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">131</span><input type="number" id="v131" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 110/111 -->
                <tr>
                  <td class="v-label">Cánones y derechos de licencia (regalías) <span class="casilla-num" style="float:right;">110</span></td>
                  <td><input type="number" id="v110" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">111</span><input type="number" id="v111" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label">Otros gastos <span class="casilla-num" style="float:right;">132</span></td>
                  <td><input type="number" id="v132" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">133</span><input type="number" id="v133" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                </tr>
                <!-- 112/113 -->
                <tr>
                  <td class="v-label">Producto de la reventa, cesión o utilización posterior,<br>que revierta al vendedor de manera directa o<br>indirecta <span class="casilla-num" style="float:right;">112</span></td>
                  <td><input type="number" id="v112" placeholder="0.00" class="form-560-calc"></td>
                  <td><span class="casilla-num">113</span><input type="number" id="v113" placeholder="0.00" class="form-560-calc" style="width: calc(100% - 15px);"></td>
                  <td class="v-label v-total"><b>Total deducciones</b></td>
                  <td style="background:#e8ecf5;"></td>
                  <td><span class="casilla-num">134</span><input type="number" id="v134" placeholder="0.00" style="font-weight:700; width: calc(100% - 15px);" readonly></td>
                </tr>
                <!-- 114 — 135 -->
                <tr>
                  <td class="v-label">
                     114. Lugar de importación
                     <div style="text-align: center; margin-top: 4px;">
                        <input type="text" id="v114" placeholder="2" style="font-size:12px;font-weight:900; width:15px; border:1px solid #1a3a6b; text-align:center;">
                        <input type="text" id="v114_2" placeholder="0" style="font-size:12px;font-weight:900; width:15px; border:1px solid #1a3a6b; text-align:center;">
                        <input type="text" id="v114_3" style="width:50px; border:1px solid #1a3a6b;">
                     </div>
                  </td>
                  <td colspan="2" style="background:#e8ecf5;"></td>
                  <td class="v-label v-total"><b>Valor de transacción declarado</b></td>
                  <td style="background:#e8ecf5;"></td>
                  <td><span class="casilla-num">135</span><input type="number" id="v135" placeholder="0.00" style="font-weight:900;font-size:10px; width: calc(100% - 15px);" readonly></td>
                </tr>
                <!-- 136 -->
                <tr>
                  <td colspan="5" style="padding:3px 4px; border-right: none;">
                    <span class="cl"><span class="cl-num">136.</span> Algunos de los importes declarados en las casillas 99, 111 y 113 tienen carácter provisional?</span>
                  </td>
                  <td style="border-left: none; text-align: center;">
                    <input type="text" class="yn" id="v136" placeholder="S/N" style="border: 1px solid #1a3a6b;">
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>

      <!-- SIGNATARIO / FIRMA -->
      <table class="form-560">
        <tr>
          <td class="sec-label" style="width:20px">Signatario</td>
          <td style="padding:0; border: none;">
            <table style="width:100%;border-collapse:collapse;font-size:8px">
              <tr>
                <td style="width:18%; border:none; border-right:1px solid #1a3a6b; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">137.</span> Número de Identificación Tributaria (NIT)</span>
                  <input type="text" id="f-snit" placeholder="NIT">
                </td>
                <td style="width:6%; border:none; border-right:1px solid #1a3a6b; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">138.</span> D.V.</span>
                  <input type="text" id="f-sdv" class="small">
                </td>
                <td style="width:18%; border:none; border-right:1px solid #1a3a6b; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">139.</span> Primer apellido</span>
                  <input type="text" id="f-sap1">
                </td>
                <td style="width:18%; border:none; border-right:1px solid #1a3a6b; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">140.</span> Segundo apellido</span>
                  <input type="text" id="f-sap2">
                </td>
                <td style="width:18%; border:none; border-right:1px solid #1a3a6b; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">141.</span> Primer nombre</span>
                  <input type="text" id="f-snom1">
                </td>
                <td style="width:22%; border:none; border-bottom:1px solid #1a3a6b;">
                  <span class="cl"><span class="cl-num">142.</span> Otros nombres</span>
                  <input type="text" id="f-snom2">
                </td>
              </tr>
              <tr>
                <td colspan="6" style="border:none; padding: 4px; padding-bottom: 20px;">
                  <span class="cl" style="margin-top: 50px;">Firma declarante</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <div style="display: flex; justify-content: flex-end; padding: 8px;">
          <div style="width:130px;text-align:right">
            <span class="cl"><span class="cl-num">997.</span> Fecha de expedición <small>(AAAA MM DD)</small></span>
            <div style="display: flex;">
              <input type="text" placeholder="AAAA" style="width:40px; border: 1px solid #1a3a6b; text-align:center;">
              <input type="text" placeholder="MM" style="width:30px; border: 1px solid #1a3a6b; text-align:center; border-left:none;">
              <input type="text" placeholder="DD" style="width:30px; border: 1px solid #1a3a6b; text-align:center; border-left:none;">
            </div>
          </div>
      </div>

    </div>
  </div>

  <!-- ========== HOJA 2 ========== -->
  <div class="paper-wrap" style="page-break-before: always;">
    <div class="paper p2" id="hoja2">

      <div class="hdr-dian">
        <div class="dian-brand">
          <div class="dian-logo-box">DIAN<span>&reg;</span></div>
          <div class="dian-sub">POR UNA COLOMBIA MÁS HONESTA</div>
        </div>
        <div class="hdr-center">
          <div class="hdr-title">Declaración Andina del Valor</div>
          <div style="font-size:8px;margin-top:3px; padding-left:8px;">Página: <input type="text" style="width:20px;display:inline;border:1px solid #1a3a6b;text-align:center;" value="2"> de <input type="text" style="width:20px;display:inline;border:1px solid #1a3a6b;text-align:center;">
          &nbsp;&nbsp;<b>Hoja No. 2</b>
          &nbsp;&nbsp;<b>4. Número de formulario:</b> <input type="text" id="h2-numform" style="width:100px;border:1px solid #1a3a6b;" placeholder="N° DAV"></div>
        </div>
        <div class="big-num" style="font-size:42px">560</div>
      </div>

      <!-- Importador hoja 2 -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="2" style="width:20px">Importador</td>
          <td colspan="4">
            <span class="cl"><span class="cl-num">5.</span> NIT</span>
            <input type="text" placeholder="Igual que hoja 1">
          </td>
          <td>
            <span class="cl"><span class="cl-num">6.</span> DV</span>
            <input type="text" class="small">
          </td>
          <td colspan="2"><span class="cl"><span class="cl-num">7.</span> Primer apellido</span><input type="text"></td>
          <td colspan="2"><span class="cl"><span class="cl-num">8.</span> Segundo apellido</span><input type="text"></td>
          <td colspan="2"><span class="cl"><span class="cl-num">9.</span> Primer nombre</span><input type="text"></td>
          <td colspan="2"><span class="cl"><span class="cl-num">10.</span> Otros nombres</span><input type="text"></td>
        </tr>
        <tr>
          <td colspan="13">
            <span class="cl"><span class="cl-num">11.</span> Razón social</span>
            <input type="text" placeholder="Igual que hoja 1">
          </td>
        </tr>
      </table>

      <!-- Descripción mercancía ítems 4-25 -->
      <table class="form-560">
        <tr>
          <td class="sec-label" rowspan="2" style="width:20px">Descripción de la mercancía</td>
          <td colspan="8" style="padding:0">
            <table class="desc-table" style="border-style: hidden;">
              <thead>
                <tr>
                  <th style="width:20px; text-align:center;">Ítem</th>
                  <th><span class="cl"><span class="cl-num">67.</span> Nombre comercial</span></th>
                  <th><span class="cl"><span class="cl-num">68.</span> Marca comercial</span></th>
                  <th style="width:60px"><span class="cl"><span class="cl-num">69.</span> Tipo</span></th>
                  <th style="width:70px"><span class="cl"><span class="cl-num">70.</span> Clase</span></th>
                  <th style="width:60px"><span class="cl"><span class="cl-num">71.</span> Modelo</span></th>
                </tr>
              </thead>
              <tbody id="h2-desc-a">
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="8" style="padding:0">
            <table class="desc-table" style="border-style: hidden;">
              <thead>
                <tr>
                  <th style="width:20px; text-align:center;">Ítem</th>
                  <th style="width:80px"><span class="cl"><span class="cl-num">72.</span> Referencia</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">73.</span> Cód.<br>Estado</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">74.</span> Año<br>fabricación</span></th>
                  <th><span class="cl"><span class="cl-num">75.</span> Otras características</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">76.</span> Cantidad</span></th>
                  <th style="width:50px"><span class="cl"><span class="cl-num">77.</span> Unid.<br>Cial.</span></th>
                  <th style="width:80px"><span class="cl"><span class="cl-num">78.</span> Precio FOB<br>unitario USD</span></th>
                </tr>
              </thead>
              <tbody id="h2-desc-b">
              </tbody>
            </table>
          </td>
        </tr>
      </table>

      <div style="padding:6px;font-size:8px;color:#888;text-align:right">
        Generado por <b>BonCloud – Smart Port Intelligence</b> | Cartagena, Colombia | Formulario 560 – DAV DIAN (Decreto 1165/2019)
      </div>

    </div>
  </div>
</div>
    `;
}

function setupForm560Logic() {
    const bodyA = document.getElementById('h2-desc-a');
    const bodyB = document.getElementById('h2-desc-b');
    if (bodyA && bodyB) {
        let aHtml = '';
        let bHtml = '';
        for (let i = 4; i <= 25; i++) {
            aHtml += `<tr><td class="row-num">${i}</td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr>`;
            bHtml += `<tr><td class="row-num">${i}</td><td><input type="text"></td><td><select style="font-size:7px;width:100%"><option value="">-</option><option value="1">1-Nuevo</option><option value="2">2-Usado</option><option value="3">3-Desarmado</option><option value="7">7-Reconstruido</option><option value="8">8-Reacondicionado</option></select></td><td><input type="text" placeholder="AAAA"></td><td><input type="text"></td><td><input type="number" placeholder="0"></td><td><input type="text" placeholder="KG/UN"></td><td><input type="number" placeholder="0.00" class="fob-unit form-560-calc"></td></tr>`;
        }
        bodyA.innerHTML = aHtml;
        bodyB.innerHTML = bHtml;
    }

    const g = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val.toFixed(2); };

    const calcValor = () => {
        const v97 = g('v94') + g('v96');
        s('v97', v97);

        const v123 = g('v99')+g('v101')+g('v103')+g('v105')+g('v107')+g('v109')+g('v111')+g('v113')+g('v116')+g('v118')+g('v120')+g('v122');
        s('v123', v123);

        const v134 = g('v125')+g('v127')+g('v129')+g('v131')+g('v133');
        s('v134', v134);

        const v135 = v97 + v123 - v134;
        s('v135', Math.max(0, v135));

        calcFOBTotal();
    };

    const calcFOBTotal = () => {
        let total = 0;
        document.querySelectorAll('.fob-unit').forEach(inp => {
            total += parseFloat(inp.value) || 0;
        });
        const el = document.getElementById('f-fob46');
        if (el && total > 0) el.value = total.toFixed(2);
    };

    document.querySelectorAll('.form-560-calc').forEach(el => el.addEventListener('input', calcValor));
}
