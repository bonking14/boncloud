function getForm560HTML() {
    return `
<style>
/* ===== BASE 560 ===== */
.form-560-wrapper {
  font-family: 'Arial Narrow', Arial, sans-serif;
  font-size: 10px;
  background: #c8cdd6;
  color: #000;
  min-height: 100vh;
  box-sizing: border-box;
}
.form-560-wrapper * {
  box-sizing: border-box;
  margin: 0; padding: 0;
}

/* ===== TOOLBAR ===== */
.form-560-wrapper .toolbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #1a3a6b;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-bottom: 3px solid #c8a951;
  box-shadow: 0 2px 12px rgba(0,0,0,.4);
}
.form-560-wrapper .toolbar-logo {
  font-size: 13px;
  font-weight: 700;
  color: #c8a951;
  margin-right: 10px;
  letter-spacing: 1px;
}
.form-560-wrapper .toolbar span {
  color: #aab8d4;
  font-size: 11px;
}
.form-560-wrapper .toolbar-spacer { flex: 1; }
.form-560-wrapper .btn-tool {
  padding: 6px 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .3px;
  transition: opacity .15s;
}
.form-560-wrapper .btn-tool:hover { opacity: .85; }
.form-560-wrapper .btn-clear { background: #3a4a6a; color: #aab8d4; border: 1px solid #4a5a7a; }
.form-560-wrapper .btn-print { background: #4a6a9a; color: #fff; }
.form-560-wrapper .btn-pdf { background: #c8a951; color: #1a1200; }
.form-560-wrapper .btn-back { background: #2a3a5a; color: #c8a951; border: 1px solid #c8a951; text-decoration: none; display: flex; align-items: center; gap: 5px; }

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
}

/* ===== FORM GLOBAL ===== */
.form-560-wrapper .form-560 {
  width: 100%;
  border-collapse: collapse;
}
.form-560-wrapper .form-560 td, .form-560-wrapper .form-560 th {
  border: 1px solid #333;
  padding: 1px 2px;
  vertical-align: top;
  font-size: 8.5px;
}
/* No-border utility */
.form-560-wrapper .nb { border: none !important; }
.form-560-wrapper .nb-r { border-right: none !important; }
.form-560-wrapper .nb-l { border-left: none !important; }
.form-560-wrapper .nb-t { border-top: none !important; }
.form-560-wrapper .nb-b { border-bottom: none !important; }

/* ===== CELL LABEL ===== */
.form-560-wrapper .cl {
  font-size: 7px;
  color: #333;
  line-height: 1.1;
  display: block;
  margin-bottom: 1px;
}
.form-560-wrapper .cl-num {
  font-size: 6.5px;
  color: #666;
  font-style: italic;
}

/* ===== EDITABLE INPUTS ===== */
.form-560-wrapper input[type="text"], .form-560-wrapper input[type="number"], .form-560-wrapper input[type="date"], .form-560-wrapper select, .form-560-wrapper textarea {
  border: none;
  border-bottom: 1px solid #1a3a6b;
  background: #f0f5ff;
  width: 100%;
  font-family: 'Arial Narrow', Arial, sans-serif;
  font-size: 8.5px;
  color: #000;
  padding: 1px 2px;
  outline: none;
  transition: background .1s;
}
.form-560-wrapper input[type="text"]:focus, .form-560-wrapper input[type="number"]:focus, .form-560-wrapper input[type="date"]:focus, .form-560-wrapper select:focus, .form-560-wrapper textarea:focus {
  background: #ddeeff;
  border-bottom-color: #c8a951;
}
.form-560-wrapper input.yn {
  width: 22px;
  text-align: center;
  font-weight: 700;
}
.form-560-wrapper input.small { width: 40px; }
.form-560-wrapper input.medium { width: 70px; }
.form-560-wrapper select { font-size: 7.5px; }

/* ===== HEADER SECTION ===== */
.form-560-wrapper .hdr-dian {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #333;
  padding: 4px 6px;
}
.form-560-wrapper .dian-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}
.form-560-wrapper .dian-logo-box {
  width: 56px;
  height: 28px;
  border: 2px solid #1a3a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: #1a3a6b;
  font-style: italic;
  letter-spacing: -1px;
}
.form-560-wrapper .dian-sub {
  font-size: 6.5px;
  color: #555;
  line-height: 1.3;
  max-width: 100px;
}
.form-560-wrapper .hdr-title {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: #1a3a6b;
  letter-spacing: .5px;
}
.form-560-wrapper .hdr-num-box {
  display: flex;
  align-items: center;
  gap: 6px;
}
.form-560-wrapper .big-num {
  font-size: 36px;
  font-weight: 900;
  color: #3a3a3a;
  line-height: 1;
  background: #e8e8e8;
  padding: 2px 10px;
  border: 2px solid #333;
  border-radius: 3px;
}
.form-560-wrapper .nota-lea {
  font-size: 7px;
  color: #555;
  font-style: italic;
  text-align: center;
  padding: 2px;
}

/* ===== SECTION HEADERS (vertical labels) ===== */
.form-560-wrapper .sec-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 7.5px;
  font-weight: 700;
  text-align: center;
  background: #d8dde8;
  border-right: 1px solid #333;
  padding: 4px 2px;
  letter-spacing: .5px;
  color: #1a3a6b;
}

/* ===== DESCRIPTION TABLE ===== */
.form-560-wrapper .desc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
}
.form-560-wrapper .desc-table th {
  background: #d8dde8;
  border: 1px solid #333;
  padding: 2px 3px;
  font-size: 7.5px;
  text-align: center;
  font-weight: 700;
  color: #1a3a6b;
}
.form-560-wrapper .desc-table td {
  border: 1px solid #333;
  padding: 1px 2px;
  vertical-align: middle;
}
.form-560-wrapper .desc-table input[type="text"], .form-560-wrapper .desc-table input[type="number"] {
  width: 100%;
}
.form-560-wrapper .row-num {
  text-align: center;
  font-weight: 700;
  font-size: 8px;
  color: #555;
  padding: 2px 4px;
  width: 18px;
}

/* ===== VALOR TABLE ===== */
.form-560-wrapper .valor-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
}
.form-560-wrapper .valor-table td {
  border: 1px solid #333;
  padding: 1px 3px;
  vertical-align: middle;
}
.form-560-wrapper .valor-table .v-label {
  font-size: 7.5px;
  line-height: 1.2;
  padding: 2px 3px;
  color: #000;
}
.form-560-wrapper .valor-table .v-col-head {
  background: #d8dde8;
  font-size: 7px;
  font-weight: 700;
  text-align: center;
  color: #1a3a6b;
  padding: 2px;
}
.form-560-wrapper .valor-table .v-total {
  background: #f0f0f0;
  font-weight: 700;
  font-size: 8px;
}
.form-560-wrapper .casilla-num {
  font-size: 6.5px;
  color: #888;
  display: block;
  font-style: italic;
}

/* FIRMA */
.form-560-wrapper .firma-row {
  border-top: 2px solid #333;
  padding: 4px 6px;
  font-size: 8px;
}
.form-560-wrapper .firma-line {
  border-top: 1px solid #333;
  margin-top: 14px;
  padding-top: 2px;
  font-size: 7px;
  color: #555;
}

/* ===== PRINT ===== */
@media print {
  .form-560-wrapper .toolbar { display: none !important; }
  .form-560-wrapper .paper-wrap { padding: 0; }
  .form-560-wrapper .paper { box-shadow: none; border: none; width: 100%; }
  .form-560-wrapper input, .form-560-wrapper select, .form-560-wrapper textarea { border-bottom: 1px solid #999 !important; background: transparent !important; }
}

/* PAGE 2 */
.form-560-wrapper .page-break { page-break-before: always; border-top: 3px dashed #aaa; margin-top: 20px; }
.form-560-wrapper .paper.p2 { margin-top: 30px; }
</style>
<div class="form-560-wrapper">

<!-- TOOLBAR -->
<div class="toolbar">
  <div class="toolbar-logo">BonCloud</div>
  <span>▸ Formularios DIAN ▸ Declaración Andina del Valor – 560</span>
  <div class="toolbar-spacer"></div>
</div>

<!-- ========== HOJA 1 ========== -->
<div class="paper-wrap">
<div class="paper" id="hoja1">

  <!-- CABECERA -->
  <div class="hdr-dian">
    <div class="dian-brand">
      <div class="dian-logo-box">DIAN</div>
      <div class="dian-sub">POR UNA COLOMBIA<br>MÁS HONESTA</div>
    </div>
    <div>
      <div class="hdr-title">Declaración Andina del Valor</div>
      <div class="nota-lea">Lea cuidadosamente las instrucciones</div>
      <div style="display:flex;gap:8px;margin-top:3px;font-size:8px;">
        <span><b>1. Año:</b> <input type="text" style="width:50px" placeholder="AAAA" id="f-anio"></span>
        <span style="flex:1"></span>
        <span><b>4. Número de formulario:</b> <input type="text" style="width:100px" id="f-numform" placeholder="N° único DAV"></span>
      </div>
    </div>
    <div class="big-num">560</div>
  </div>

  <!-- IMPORTADOR -->
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="2" style="width:14px">Importador</td>
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
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="6" style="width:14px">Datos generales</td>
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
    <tr style="background:#f8f8f8">
      <td colspan="9" style="padding:3px 4px">
        <table style="width:100%;border-collapse:collapse;font-size:8px">
          <tr>
            <td style="width:33%">
              <span class="cl"><span class="cl-num">47.</span> Cód. Moneda</span>
              <select id="f-mon47" style="font-size:7.5px">
                <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option><option>COP</option>
              </select>
              &nbsp;<span class="cl-num">48.</span> Tipo cambio: <input type="number" style="width:55px" id="f-tc48" placeholder="1.00">
              &nbsp;<span class="cl-num">49.</span> Fecha: <input type="date" id="f-fecha49" style="width:90px">
            </td>
            <td style="width:33%">
              <span class="cl"><span class="cl-num">50.</span> Cód. Moneda</span>
              <select id="f-mon50" style="font-size:7.5px">
                <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option>
              </select>
              &nbsp;<span class="cl-num">51.</span> Tipo cambio: <input type="number" style="width:55px" id="f-tc51" placeholder="1.00">
              &nbsp;<span class="cl-num">52.</span> Fecha: <input type="date" id="f-fecha52" style="width:90px">
            </td>
            <td style="width:34%">
              <span class="cl"><span class="cl-num">53.</span> Cód. Moneda</span>
              <select id="f-mon53" style="font-size:7.5px">
                <option value="">-</option><option>USD</option><option>EUR</option><option>CNY</option><option>GBP</option>
              </select>
              &nbsp;<span class="cl-num">54.</span> Tipo cambio: <input type="number" style="width:55px" id="f-tc54" placeholder="1.00">
              &nbsp;<span class="cl-num">55.</span> Fecha: <input type="date" id="f-fecha55" style="width:90px">
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- INTERMEDIACIÓN -->
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="3" style="width:14px">Intermediación</td>
      <td style="width:60px">
        <span class="cl"><span class="cl-num">56.</span> ¿Existe intermediación?</span>
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
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="8" style="width:14px">Descripción de la mercancía</td>
      <td colspan="8" style="padding:0">
        <table class="desc-table">
          <thead>
            <tr>
              <th style="width:20px">Ítem</th>
              <th><span class="cl-num">67.</span> Nombre comercial</th>
              <th><span class="cl-num">68.</span> Marca comercial</th>
              <th style="width:60px"><span class="cl-num">69.</span> Tipo</th>
              <th style="width:70px"><span class="cl-num">70.</span> Clase</th>
              <th style="width:60px"><span class="cl-num">71.</span> Modelo</th>
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
        <table class="desc-table">
          <thead>
            <tr>
              <th style="width:20px">Ítem</th>
              <th style="width:80px"><span class="cl-num">72.</span> Referencia</th>
              <th style="width:50px"><span class="cl-num">73.</span> Cód. Estado</th>
              <th style="width:50px"><span class="cl-num">74.</span> Año fabric.</th>
              <th><span class="cl-num">75.</span> Otras características</th>
              <th style="width:50px"><span class="cl-num">76.</span> Cantidad</th>
              <th style="width:50px"><span class="cl-num">77.</span> Unid. Cial.</th>
              <th style="width:80px"><span class="cl-num">78.</span> Precio FOB unitario USD</th>
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
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" style="width:14px">Requisitos</td>
      <td style="width:70px">
        <span class="cl"><span class="cl-num">79.</span> ¿Existen restricciones?</span>
        <input type="text" class="yn" id="f-r79" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">80.</span> Cód. Tipo restricción</span>
        <select id="f-r80" style="font-size:7.5px">
          <option value="">-</option>
          <option value="01">01 – Impuestas por ley</option>
          <option value="02">02 – Limitan territorio reventa</option>
          <option value="03">03 – No afectan valor</option>
          <option value="04">04 – Otro tipo</option>
        </select>
      </td>
      <td>
        <span class="cl"><span class="cl-num">81.</span> ¿Existen condiciones o contraprestaciones?</span>
        <input type="text" class="yn" id="f-r81" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">82.</span> Cód. Tipo condición o contraprestación</span>
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
        <span class="cl"><span class="cl-num">84.</span> ¿Puede determinarse?</span>
        <input type="text" class="yn" id="f-r84" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">85.</span> ¿Existen cánones y derechos de licencia?</span>
        <input type="text" class="yn" id="f-r85" placeholder="S/N">
      </td>
    </tr>
    <tr>
      <td class="sec-label" style="width:14px"></td>
      <td colspan="2">
        <span class="cl"><span class="cl-num">86.</span> ¿Existen reversiones al vendedor?</span>
        <input type="text" class="yn" id="f-r86" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">87.</span> ¿Existe vinculación comprador–vendedor?</span>
        <input type="text" class="yn" id="f-r87" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">88.</span> Cód. Tipo vinculación</span>
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
        <span class="cl"><span class="cl-num">89.</span> ¿Influye vinculación en el precio?</span>
        <input type="text" class="yn" id="f-r89" placeholder="S/N">
      </td>
      <td>
        <span class="cl"><span class="cl-num">90.</span> ¿Existen valores criterio?</span>
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
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="20" style="width:14px">Determinación del valor en aduana</td>
      <td colspan="6" style="padding:0">
        <table class="valor-table" style="width:100%">
          <thead>
            <tr>
              <td style="width:40%;font-size:8px;font-weight:700;padding:3px;background:#e8ecf5;color:#1a3a6b;">Concepto</td>
              <td class="v-col-head" style="width:22%">Valor moneda<br>facturación ≠ USD</td>
              <td class="v-col-head" style="width:13%">USD</td>
              <td style="width:40%;font-size:8px;font-weight:700;padding:3px;background:#e8ecf5;color:#1a3a6b;">Concepto</td>
              <td class="v-col-head" style="width:22%">Valor moneda<br>facturación ≠ USD</td>
              <td class="v-col-head" style="width:13%">USD</td>
            </tr>
          </thead>
          <tbody>
            <!-- Fila 93/94 — 115/116 -->
            <tr>
              <td class="v-label"><span class="casilla-num">93/94</span>Precio neto según factura</td>
              <td><input type="number" id="v93" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v94" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">115/116</span>Gastos transporte, manejo y entrega en exterior hasta lugar embarque</td>
              <td><input type="number" id="v115" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v116" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 95/96 — 117/118 -->
            <tr>
              <td class="v-label"><span class="casilla-num">95/96</span>Pagos indirectos, descuentos retroactivos u otros</td>
              <td><input type="number" id="v95" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v96" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">117/118</span>Gastos de transporte desde lugar de embarque hasta lugar de importación (flete)</td>
              <td><input type="number" id="v117" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v118" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 97 — 119/120 -->
            <tr style="background:#f5f5f5">
              <td class="v-label v-total"><span class="casilla-num">97</span><b>Precio pagado o por pagar</b></td>
              <td></td>
              <td><input type="number" id="v97" placeholder="0.00" style="font-weight:700;background:#e8f0ff" readonly></td>
              <td class="v-label"><span class="casilla-num">119/120</span>Gastos de carga, descarga y manipulación</td>
              <td><input type="number" id="v119" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v120" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- ENCABEZADO ADICIONES -->
            <tr><td colspan="3" style="background:#dde4f0;font-weight:700;font-size:7.5px;color:#1a3a6b;padding:2px 4px;">ADICIONES (elementos del valor no incluidos en el precio)</td>
              <td class="v-label"><span class="casilla-num">121/122</span>Seguro</td>
              <td><input type="number" id="v121" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v122" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 98/99 -->
            <tr>
              <td class="v-label"><span class="casilla-num">98/99</span>Comisiones, corretajes (excepto comisiones de compra)</td>
              <td><input type="number" id="v98" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v99" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label v-total" style="background:#f5f5f5"><b><span class="casilla-num">123</span>TOTAL ADICIONES</b></td>
              <td></td>
              <td><input type="number" id="v123" placeholder="0.00" style="font-weight:700;background:#e8f0ff" readonly></td>
            </tr>
            <!-- 100/101 -->
            <tr>
              <td class="v-label"><span class="casilla-num">100/101</span>Envases y embalajes</td>
              <td><input type="number" id="v100" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v101" placeholder="0.00" class="form-560-calc"></td>
              <td colspan="3" style="background:#dde4f0;font-weight:700;font-size:7.5px;color:#1a3a6b;padding:2px 4px;">DEDUCCIONES (gastos no parte del valor en aduana)</td>
            </tr>
            <!-- 102/103 -->
            <tr>
              <td class="v-label"><span class="casilla-num">102/103</span>Prestaciones en materias primas y otros</td>
              <td><input type="number" id="v102" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v103" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">124/125</span>Gastos de entrega posteriores a la importación</td>
              <td><input type="number" id="v124" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v125" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 104/105 -->
            <tr>
              <td class="v-label"><span class="casilla-num">104/105</span>Prestaciones en herramientas, matrices, moldes, etc.</td>
              <td><input type="number" id="v104" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v105" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">126/127</span>Gastos de construcción, armado, instalación, montaje, mantenimiento y asistencia técnica, posteriores a importación</td>
              <td><input type="number" id="v126" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v127" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 106/107 -->
            <tr>
              <td class="v-label"><span class="casilla-num">106/107</span>Prestaciones en insumos y otros</td>
              <td><input type="number" id="v106" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v107" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">128/129</span>Derechos de aduana y otros impuestos</td>
              <td><input type="number" id="v128" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v129" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 108/109 -->
            <tr>
              <td class="v-label"><span class="casilla-num">108/109</span>Prestaciones en ingeniería, creación, planos, otros</td>
              <td><input type="number" id="v108" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v109" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">130/131</span>Intereses</td>
              <td><input type="number" id="v130" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v131" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 110/111 -->
            <tr>
              <td class="v-label"><span class="casilla-num">110/111</span>Cánones y derechos de licencia (regalías)</td>
              <td><input type="number" id="v110" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v111" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label"><span class="casilla-num">132/133</span>Otros gastos</td>
              <td><input type="number" id="v132" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v133" placeholder="0.00" class="form-560-calc"></td>
            </tr>
            <!-- 112/113 -->
            <tr>
              <td class="v-label"><span class="casilla-num">112/113</span>Producto de la reventa, cesión o utilización posterior, que revierta al vendedor de manera directa o indirecta</td>
              <td><input type="number" id="v112" placeholder="0.00" class="form-560-calc"></td>
              <td><input type="number" id="v113" placeholder="0.00" class="form-560-calc"></td>
              <td class="v-label v-total" style="background:#f5f5f5"><b><span class="casilla-num">134</span>TOTAL DEDUCCIONES</b></td>
              <td></td>
              <td><input type="number" id="v134" placeholder="0.00" style="font-weight:700;background:#e8f0ff" readonly></td>
            </tr>
            <!-- 114 — 135 -->
            <tr style="background:#eef3ff">
              <td class="v-label"><span class="casilla-num">114</span>Lugar de importación (Cód. Dir. Seccional) <b>2 0</b></td>
              <td colspan="2"><input type="text" id="v114" placeholder="20 – Cartagena" style="font-size:9px;font-weight:700"></td>
              <td class="v-label v-total" style="background:#1a3a6b;color:#c8a951"><b><span class="casilla-num" style="color:#aac">135</span>VALOR DE TRANSACCIÓN DECLARADO (USD)</b></td>
              <td></td>
              <td><input type="number" id="v135" placeholder="0.00" style="font-weight:900;font-size:11px;background:#ddeeff;color:#1a3a6b" readonly></td>
            </tr>
            <!-- 136 -->
            <tr>
              <td colspan="6" style="padding:3px 4px">
                <span class="cl"><span class="cl-num">136.</span> ¿Algunos de los importes declarados en las casillas 99, 111 y 113 tienen carácter provisional?</span>
                <input type="text" class="yn" id="v136" placeholder="S/N">
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>

  <!-- SIGNATARIO / FIRMA -->
  <div class="firma-row">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="width:12px;writing-mode:vertical-rl;transform:rotate(180deg);font-size:7.5px;font-weight:700;background:#d8dde8;border:1px solid #333;padding:3px 2px;color:#1a3a6b;text-align:center">Signatario</td>
        <td style="border:1px solid #333;padding:3px">
          <table style="width:100%;border-collapse:collapse;font-size:8px">
            <tr>
              <td style="width:18%">
                <span class="cl"><span class="cl-num">137.</span> NIT Signatario</span>
                <input type="text" id="f-snit" placeholder="NIT">
              </td>
              <td style="width:6%">
                <span class="cl"><span class="cl-num">138.</span> DV</span>
                <input type="text" id="f-sdv" class="small">
              </td>
              <td style="width:18%">
                <span class="cl"><span class="cl-num">139.</span> Primer apellido</span>
                <input type="text" id="f-sap1">
              </td>
              <td style="width:18%">
                <span class="cl"><span class="cl-num">140.</span> Segundo apellido</span>
                <input type="text" id="f-sap2">
              </td>
              <td style="width:18%">
                <span class="cl"><span class="cl-num">141.</span> Primer nombre</span>
                <input type="text" id="f-snom1">
              </td>
              <td style="width:22%">
                <span class="cl"><span class="cl-num">142.</span> Otros nombres</span>
                <input type="text" id="f-snom2">
              </td>
            </tr>
          </table>
          <div class="firma-line">Firma declarante</div>
        </td>
        <td style="border:1px solid #333;padding:3px;width:130px;text-align:right">
          <span class="cl"><span class="cl-num">997.</span> Fecha de expedición <small>(AAAA MM DD)</small></span>
          <input type="date" id="f-fechaexp" style="width:110px">
        </td>
      </tr>
    </table>
  </div>

</div><!-- /paper hoja1 -->
</div>

<!-- ========== HOJA 2 ========== -->
<div class="paper-wrap">
<div class="paper p2" id="hoja2">

  <div class="hdr-dian">
    <div class="dian-brand">
      <div class="dian-logo-box">DIAN</div>
      <div class="dian-sub">POR UNA COLOMBIA<br>MÁS HONESTA</div>
    </div>
    <div>
      <div class="hdr-title">Declaración Andina del Valor</div>
      <div style="font-size:8px;margin-top:3px">Página: <input type="text" style="width:20px;display:inline" placeholder="2"> de <input type="text" style="width:20px;display:inline" placeholder="">
      &nbsp;&nbsp;<b>Hoja No. 2</b>
      &nbsp;&nbsp;<b>4. Número de formulario:</b> <input type="text" id="h2-numform" style="width:100px" placeholder="N° DAV"></div>
    </div>
    <div class="big-num" style="font-size:28px">560</div>
  </div>

  <!-- Importador hoja 2 -->
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="2" style="width:14px">Importador</td>
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
  <table class="form-560" style="width:100%">
    <tr>
      <td class="sec-label" rowspan="2" style="width:14px">Descripción de la mercancía</td>
      <td colspan="8" style="padding:0">
        <table class="desc-table">
          <thead>
            <tr>
              <th style="width:20px">Ítem</th>
              <th><span class="cl-num">67.</span> Nombre comercial</th>
              <th><span class="cl-num">68.</span> Marca comercial</th>
              <th style="width:60px"><span class="cl-num">69.</span> Tipo</th>
              <th style="width:70px"><span class="cl-num">70.</span> Clase</th>
              <th style="width:60px"><span class="cl-num">71.</span> Modelo</th>
            </tr>
          </thead>
          <tbody id="h2-desc-a">
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="8" style="padding:0">
        <table class="desc-table">
          <thead>
            <tr>
              <th style="width:20px">Ítem</th>
              <th style="width:80px"><span class="cl-num">72.</span> Referencia</th>
              <th style="width:50px"><span class="cl-num">73.</span> Cód. Estado</th>
              <th style="width:50px"><span class="cl-num">74.</span> Año fabric.</th>
              <th><span class="cl-num">75.</span> Otras características</th>
              <th style="width:50px"><span class="cl-num">76.</span> Cantidad</th>
              <th style="width:50px"><span class="cl-num">77.</span> Unid. Cial.</th>
              <th style="width:80px"><span class="cl-num">78.</span> Precio FOB unitario</th>
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

</div><!-- /paper hoja2 -->
</div>
</div>
    `;
}
