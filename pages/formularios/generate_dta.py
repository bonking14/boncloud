import os

path = "/home/bon/boncloud/pages/formularios/form-dta-transito.html"

html_head = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Formulario DTA - Declaración de Tránsito Aduanero</title>
<style>
/* CSS Styles */
:root {
  --color-primary: #1a3a6b;
  --bg-color: #ffffff;
  --border-color: #000000;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 794px;
  justify-content: space-between;
}
.nav-btn {
  padding: 10px 20px;
  border: none;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}
.nav-btn.back-btn {
  background-color: #666;
}
.form-container {
  background: white;
  width: 794px;
  box-sizing: border-box;
  padding: 8mm;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  position: relative;
}
.header {
  display: flex;
  height: 60px;
  border: 1px solid var(--border-color);
  margin-bottom: 5px;
}
.logo-dian {
  width: 150px;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.logo-dian span:first-child { font-size: 24px; }
.logo-dian span:last-child { font-size: 6px; }
.title-center {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}
.title-center h1 { margin: 0; font-size: 14px; text-transform: uppercase; }
.title-center h2 { margin: 0; font-size: 10px; font-weight: normal; }
.form-num {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
}
.sub-header {
  display: flex;
  border: 1px solid var(--border-color);
  margin-bottom: 5px;
  font-size: 8px;
}
.sub-header > div {
  padding: 2px 5px;
  border-right: 1px solid var(--border-color);
}
.sub-header > div:last-child { border-right: none; }
.cell {
  border-right: 1px solid var(--border-color);
  padding: 2px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.cell:last-child { border-right: none; }
.cell-num {
  font-size: 6px;
  color: #333;
  position: absolute;
  top: 1px;
  left: 2px;
}
.cell-label {
  font-size: 7px;
  margin-top: 6px;
  margin-bottom: 2px;
  color: #000;
  text-align: center;
  font-weight: bold;
}
.cell input, .cell select, .cell textarea {
  border: none;
  width: 100%;
  font-size: 9px;
  font-family: Arial;
  outline: none;
  box-sizing: border-box;
  background: transparent;
  color: #000;
  text-align: center;
}
.cell textarea {
  text-align: left;
  resize: none;
  height: 40px;
  padding: 5px;
}
.cell input.error {
  border: 1px solid red;
  background-color: #ffe6e6;
}
.cell input[readonly] {
  background-color: #f5f5f5;
  font-weight: bold;
}
.section-title {
  background-color: var(--color-primary);
  color: white;
  text-align: center;
  font-size: 8px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 2px;
  border: 1px solid var(--border-color);
  margin-top: 5px;
}
.row {
  display: flex;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.flex-3 { flex: 3; }
.flex-4 { flex: 4; }
.flex-5 { flex: 5; }

@media print {
  body {
    background-color: white;
    padding: 0;
    align-items: flex-start;
  }
  .nav-bar {
    display: none;
  }
  .form-container {
    box-shadow: none;
    margin: 0;
    padding: 8mm;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
}
</style>
</head>
<body>
<div class="nav-bar">
  <button class="nav-btn back-btn" onclick="window.history.back()">Volver</button>
  <button class="nav-btn" style="background-color: #4CAF50;" onclick="validateAndPrint()">Validar y Exportar PDF</button>
</div>
"""

body_content = """
<div id="form-dta" class="form-container">
  
  <div class="header">
    <div class="logo-dian">
      <span>DIAN</span>
      <span>POR UNA COLOMBIA MÁS HONESTA</span>
    </div>
    <div class="title-center">
      <h1>Declaración de Tránsito Aduanero</h1>
      <h2>DTA / Cabotaje</h2>
    </div>
    <div class="form-num">
      <div style="border: 1px solid var(--color-primary); padding: 5px 15px;">DTA</div>
    </div>
  </div>
  <div class="sub-header">
    <div style="flex: 2;">Espacio reservado para la DIAN</div>
    <div style="flex: 1; display:flex; align-items:center;">1. Año <input type="text" style="width:40px; margin-left:5px; border:none; border-bottom:1px solid #000; font-size:8px; outline:none;" placeholder="AAAA"></div>
    <div style="flex: 2; display:flex; align-items:center;">4. Número de formulario <input type="text" style="width:100px; margin-left:5px; border:none; border-bottom:1px solid #000; font-size:8px; outline:none;"></div>
  </div>

  <div class="section-title">DECLARANTE / AGENCIA DE ADUANAS</div>
  <div class="row">
    <div class="cell flex-2">
      <span class="cell-num">5</span><span class="cell-label">NIT</span>
      <input type="text" id="dec_nit" oninput="calculateDV(this.value, 'dec_dv')">
    </div>
    <div class="cell" style="width: 30px;">
      <span class="cell-num">6</span><span class="cell-label">DV</span>
      <input type="text" id="dec_dv" readonly>
    </div>
    <div class="cell flex-5">
      <span class="cell-num">7</span><span class="cell-label">Razón Social o Nombre del Declarante</span>
      <input type="text" id="dec_razon">
    </div>
    <div class="cell flex-1">
      <span class="cell-num">8</span><span class="cell-label">Cód. Tipo Usuario</span>
      <input type="text">
    </div>
  </div>

  <div class="section-title">DATOS DEL TRANSPORTADOR (EMPRESA DE TRANSPORTE)</div>
  <div class="row">
    <div class="cell flex-2">
      <span class="cell-num">9</span><span class="cell-label">NIT Transportador</span>
      <input type="text" id="trans_nit" oninput="calculateDV(this.value, 'trans_dv')">
    </div>
    <div class="cell" style="width: 30px;">
      <span class="cell-num">10</span><span class="cell-label">DV</span>
      <input type="text" id="trans_dv" readonly>
    </div>
    <div class="cell flex-5">
      <span class="cell-num">11</span><span class="cell-label">Razón Social Transportador</span>
      <input type="text">
    </div>
    <div class="cell flex-2">
      <span class="cell-num">12</span><span class="cell-label">Placa del Vehículo</span>
      <input type="text" id="trans_placa">
    </div>
  </div>
  <div class="row">
    <div class="cell flex-2"><span class="cell-num">13</span><span class="cell-label">Nombre del Conductor</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">14</span><span class="cell-label">Cédula del Conductor</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">15</span><span class="cell-label">N° Licencia de Tránsito</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">16</span><span class="cell-label">N° Manifiesto de Carga</span><input type="text"></div>
  </div>

  <div class="section-title">INFORMACIÓN GENERAL DE LA RUTA Y ADUANAS</div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">30</span><span class="cell-label">Cód. Aduana de Partida</span><input type="text" id="aduana_partida"></div>
    <div class="cell flex-1"><span class="cell-num">31</span><span class="cell-label">Cód. Aduana de Destino</span><input type="text" id="aduana_destino"></div>
    <div class="cell flex-1"><span class="cell-num">32</span><span class="cell-label">Cód. Aduana de Paso (Frontera)</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">33</span><span class="cell-label">Modalidad (Tránsito/Cabotaje)</span><input type="text"></div>
  </div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">34</span><span class="cell-label">Lugar de Entrega Autorizado</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">35</span><span class="cell-label">Plazo Autorizado (Días)</span><input type="number"></div>
    <div class="cell flex-1"><span class="cell-num">36</span><span class="cell-label">Ruta Autorizada</span><input type="text"></div>
  </div>

  <div class="section-title">MERCANCÍA Y PRECINTOS</div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">40</span><span class="cell-label">N° de Bultos / Contenedores</span><input type="number" id="m_bultos" class="calc-trigger"></div>
    <div class="cell flex-1"><span class="cell-num">41</span><span class="cell-label">Peso Bruto Total (Kgs)</span><input type="number" id="m_peso" class="calc-trigger" step="0.01"></div>
    <div class="cell flex-1"><span class="cell-num">42</span><span class="cell-label">Valor Total (USD)</span><input type="number" id="m_valor" class="calc-trigger" step="0.01"></div>
    <div class="cell flex-2"><span class="cell-num">43</span><span class="cell-label">Números de Precintos (Sellos)</span><input type="text" placeholder="Ej: A1234, B5678"></div>
  </div>
  <div class="row">
    <div class="cell flex-1">
      <span class="cell-num">44</span><span class="cell-label" style="text-align: left; margin-left: 10px;">Descripción General de la Mercancía</span>
      <textarea id="m_desc"></textarea>
    </div>
  </div>
  
  <div class="section-title">GARANTÍAS Y TRIBUTOS SUSPENDIDOS</div>
  <div class="row" style="background-color: #fcfcfc;">
    <div class="cell flex-1"><span class="cell-num">50</span><span class="cell-label">N° Garantía Aceptada</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">51</span><span class="cell-label">Aseguradora / Entidad</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">52</span><span class="cell-label">Fecha Vencimiento</span><input type="text" placeholder="AAAA-MM-DD"></div>
    <div class="cell flex-1" style="border-left: 2px solid var(--color-primary);"><span class="cell-num">53</span><span class="cell-label" style="color: var(--color-primary);">Tributos Suspendidos (COP)</span><input type="number" id="t_suspendidos" placeholder="0.00" style="font-weight: bold;"></div>
  </div>
  
  <div class="section-title" style="margin-top: 10px;">DATOS DE ACEPTACIÓN / CONTROL ADUANERO (Uso exclusivo DIAN)</div>
  <div class="row">
    <div class="cell flex-1" style="height: 40px;">
      <span class="cell-num">60</span><span class="cell-label">Fecha y Hora Autorización (Partida)</span>
    </div>
    <div class="cell flex-1">
      <span class="cell-num">61</span><span class="cell-label">Número de Aceptación DTA</span>
    </div>
    <div class="cell flex-1">
      <span class="cell-num">62</span><span class="cell-label">Fecha y Hora Llegada (Destino)</span>
    </div>
    <div class="cell flex-1">
      <span class="cell-num">63</span><span class="cell-label">Observaciones Aduana Destino</span>
    </div>
  </div>

  <div style="display: flex; gap: 5px; margin-top: 10px; height: 130px;">
    <div style="flex: 1; border: 1px solid var(--border-color); position:relative; padding:5px; font-size:7px; line-height:1.2;">
      Declaro que la información contenida es exacta y veraz. Me comprometo a cumplir con la ruta y los plazos estipulados para la entrega de la mercancía amparada en este Tránsito Aduanero.
      <div style="position:absolute; bottom: 5px; left: 5px; right: 5px;">
        <div style="border-bottom: 1px solid var(--border-color); height: 30px;"></div>
        <div style="font-size:8px; margin-top:2px; font-weight:bold;">Firma del Declarante Autorizado</div>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid var(--border-color); position:relative; padding:5px; font-size:7px; line-height:1.2;">
      El transportador asume la responsabilidad solidaria por la mercancía hasta su entrega en la Aduana de Destino.
      <div style="position:absolute; bottom: 5px; left: 5px; right: 5px;">
        <div style="border-bottom: 1px solid var(--border-color); height: 30px;"></div>
        <div style="font-size:8px; margin-top:2px; font-weight:bold;">Firma del Conductor / Transportador</div>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid var(--border-color); position:relative; padding:5px; font-size:7px;">
      Espacio exclusivo para firmas y sellos de funcionarios de la DIAN (Partida y Destino).
    </div>
  </div>

</div>
"""

scripts = """
<script>
  function calculateDV(nit, dvId) {
    let dv = 0;
    if(nit) {
        let cleanNit = nit.replace(/[^0-9]/g, '').substring(0, 10);
        const pesos = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
        let suma = 0;
        let strNit = cleanNit.padStart(15, '0');
        for (let i = 0; i < 15; i++) {
            suma += parseInt(strNit[i]) * pesos[i];
        }
        let residuo = suma % 11;
        if (residuo === 0) dv = 0;
        else if (residuo === 1) dv = 1;
        else dv = 11 - residuo;
    } else {
        dv = '';
    }
    const el = document.getElementById(dvId);
    if(el) el.value = dv;
  }

  function validateAndPrint() {
    const required = [
      {id: 'dec_nit', name: 'NIT del Declarante'},
      {id: 'dec_razon', name: 'Razón Social del Declarante'},
      {id: 'trans_nit', name: 'NIT del Transportador'},
      {id: 'trans_placa', name: 'Placa del Vehículo'},
      {id: 'aduana_partida', name: 'Aduana de Partida'},
      {id: 'aduana_destino', name: 'Aduana de Destino'}
    ];
    let hasError = false;
    let errorMsg = "Faltan campos obligatorios:\\n";
    required.forEach(field => {
      const el = document.getElementById(field.id);
      if(!el.value.trim()) {
        el.classList.add('error');
        hasError = true;
        errorMsg += "- " + field.name + "\\n";
      } else {
        el.classList.remove('error');
      }
    });

    if(hasError) {
      alert(errorMsg);
    } else {
      window.print();
    }
  }
</script>
</body>
</html>
"""

with open(path, "w") as f:
    f.write(html_head)
    f.write(body_content)
    f.write(scripts)

print("Formulario DTA generated successfully.")
