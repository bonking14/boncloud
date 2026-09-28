import os

path = "/home/bon/boncloud/pages/formularios/form-600-exportacion.html"

html_head = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Formulario 600 - Declaración de Exportación (DEX)</title>
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
.cell input, .cell select {
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
<div id="form-600" class="form-container">
  
  <div class="header">
    <div class="logo-dian">
      <span>DIAN</span>
      <span>POR UNA COLOMBIA MÁS HONESTA</span>
    </div>
    <div class="title-center">
      <h1>Declaración de Exportación</h1>
      <h2>Definitiva</h2>
    </div>
    <div class="form-num">
      <div style="border: 1px solid var(--color-primary); padding: 5px 15px;">600</div>
    </div>
  </div>
  <div class="sub-header">
    <div style="flex: 2;">Espacio reservado para la DIAN</div>
    <div style="flex: 1; display:flex; align-items:center;">1. Año <input type="text" style="width:40px; margin-left:5px; border:none; border-bottom:1px solid #000; font-size:8px; outline:none;" placeholder="AAAA"></div>
    <div style="flex: 2; display:flex; align-items:center;">4. Número de formulario <input type="text" style="width:100px; margin-left:5px; border:none; border-bottom:1px solid #000; font-size:8px; outline:none;"></div>
  </div>

  <div class="section-title">EXPORTADOR</div>
  <div class="row">
    <div class="cell flex-2">
      <span class="cell-num">5</span><span class="cell-label">NIT</span>
      <input type="text" id="exp_nit" oninput="calculateDV(this.value, 'exp_dv')">
    </div>
    <div class="cell" style="width: 30px;">
      <span class="cell-num">6</span><span class="cell-label">DV</span>
      <input type="text" id="exp_dv" readonly>
    </div>
    <div class="cell flex-2">
      <span class="cell-num">7</span><span class="cell-label">Primer Apellido</span>
      <input type="text">
    </div>
    <div class="cell flex-2">
      <span class="cell-num">8</span><span class="cell-label">Segundo Apellido</span>
      <input type="text">
    </div>
    <div class="cell flex-2">
      <span class="cell-num">9</span><span class="cell-label">Primer Nombre</span>
      <input type="text">
    </div>
    <div class="cell flex-2">
      <span class="cell-num">10</span><span class="cell-label">Otros Nombres</span>
      <input type="text">
    </div>
  </div>
  <div class="row">
    <div class="cell flex-4">
      <span class="cell-num">11</span><span class="cell-label">Razón Social</span>
      <input type="text" id="exp_razon">
    </div>
    <div class="cell flex-1">
      <span class="cell-num">12</span><span class="cell-label">Cód. Dirección Seccional</span>
      <input type="text">
    </div>
  </div>

  <div class="section-title">DECLARANTE</div>
  <div class="row">
    <div class="cell flex-2">
      <span class="cell-num">24</span><span class="cell-label">NIT</span>
      <input type="text" oninput="calculateDV(this.value, 'dec_dv')">
    </div>
    <div class="cell" style="width: 30px;">
      <span class="cell-num">25</span><span class="cell-label">DV</span>
      <input type="text" id="dec_dv" readonly>
    </div>
    <div class="cell flex-5">
      <span class="cell-num">26</span><span class="cell-label">Razón Social</span>
      <input type="text">
    </div>
    <div class="cell flex-1">
      <span class="cell-num">27</span><span class="cell-label">Tipo Usuario</span>
      <input type="text">
    </div>
  </div>

  <div class="section-title">DATOS GENERALES DE LA EXPORTACIÓN</div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">30</span><span class="cell-label">Cód. Administración</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">31</span><span class="cell-label">Año Autorización</span><input type="text" placeholder="AAAA"></div>
    <div class="cell flex-2"><span class="cell-num">32</span><span class="cell-label">No. Autorización</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">33</span><span class="cell-label">Fecha Modificación</span><input type="text" placeholder="AAAA-MM-DD"></div>
  </div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">34</span><span class="cell-label">Modalidad Exportación</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">35</span><span class="cell-label">Clase Exportación</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">36</span><span class="cell-label">Datos Anteriores</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">37</span><span class="cell-label">Cód. Vía Transporte</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">38</span><span class="cell-label">Cód. País Destino</span><input type="text" id="pais_destino"></div>
  </div>
  <div class="row">
    <div class="cell flex-2"><span class="cell-num">40</span><span class="cell-label">Datos del Documento de Transporte</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">41</span><span class="cell-label">Fecha Doc. Transporte</span><input type="text" placeholder="AAAA-MM-DD"></div>
    <div class="cell flex-1"><span class="cell-num">42</span><span class="cell-label">Cód. Unidad Medida</span><input type="text"></div>
    <div class="cell flex-1"><span class="cell-num">43</span><span class="cell-label">Cantidad Carga</span><input type="number"></div>
  </div>

  <div class="section-title">TOTALES</div>
  <div class="row">
    <div class="cell flex-1"><span class="cell-num">44</span><span class="cell-label">Total Peso Bruto (Kgs)</span><input type="number" step="0.01"></div>
    <div class="cell flex-1"><span class="cell-num">45</span><span class="cell-label">Total Peso Neto (Kgs)</span><input type="number" step="0.01"></div>
    <div class="cell flex-1"><span class="cell-num">46</span><span class="cell-label">Total Series Carga</span><input type="number"></div>
  </div>
  <div class="row" style="background-color: #fcfcfc;">
    <div class="cell flex-1"><span class="cell-num">47</span><span class="cell-label">Valor Total FOB (USD)</span><input type="number" id="t_fob" class="calc-trigger" value="0"></div>
    <div class="cell flex-1"><span class="cell-num">48</span><span class="cell-label">Valor Fletes (USD)</span><input type="number" id="t_fletes" class="calc-trigger" value="0"></div>
    <div class="cell flex-1"><span class="cell-num">49</span><span class="cell-label">Valor Seguros (USD)</span><input type="number" id="t_seguros" class="calc-trigger" value="0"></div>
    <div class="cell flex-1"><span class="cell-num">50</span><span class="cell-label">Otros Gastos (USD)</span><input type="number" id="t_otros" class="calc-trigger" value="0"></div>
    <div class="cell flex-1" style="border-left: 2px solid var(--color-primary);"><span class="cell-num">51</span><span class="cell-label" style="color: var(--color-primary);">Valor Total Agregado (USD)</span><input type="number" id="t_agregado" readonly style="font-weight: bold;"></div>
  </div>
  
  <div class="section-title" style="margin-top: 10px;">DATOS DE ACEPTACIÓN / CERTIFICADO DE EMBARQUE (Exclusivo DIAN)</div>
  <div class="row">
    <div class="cell flex-1" style="height: 60px;">
      <span class="cell-num">52</span><span class="cell-label">Fecha Aceptación DEX</span>
    </div>
    <div class="cell flex-1">
      <span class="cell-num">53</span><span class="cell-label">Número de Aceptación DEX</span>
    </div>
    <div class="cell flex-1">
      <span class="cell-num">54</span><span class="cell-label">Fecha Autorización de Embarque</span>
    </div>
  </div>

  <div style="display: flex; gap: 5px; margin-top: 10px; height: 120px;">
    <div style="flex: 1; border: 1px solid var(--border-color); position:relative; padding:5px; font-size:7px; line-height:1.2;">
      Declaro bajo la gravedad de juramento que los datos aquí consignados son correctos, no incluyen omisiones o falsedades y que el producto exportado cumple con todos los requisitos legales vigentes correspondientes.
      <div style="position:absolute; bottom: 5px; left: 5px; right: 5px;">
        <div style="border-bottom: 1px solid var(--border-color); height: 30px;"></div>
        <div style="font-size:8px; margin-top:2px; font-weight:bold;">Firma del Declarante</div>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid var(--border-color); position:relative; padding:5px; font-size:7px;">
      Espacio exclusivo para sello y firma del Funcionario Aduanero.
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

  function performCalculations() {
    const getVal = id => parseFloat(document.getElementById(id).value) || 0;
    const setVal = (id, val) => document.getElementById(id).value = val.toFixed(2);

    const fob = getVal('t_fob');
    const fletes = getVal('t_fletes');
    const seguros = getVal('t_seguros');
    const otros = getVal('t_otros');
    
    // Valor total agregado USD
    const agregado = fob + fletes + seguros + otros;
    setVal('t_agregado', agregado);
  }

  document.querySelectorAll('.calc-trigger').forEach(input => {
    input.addEventListener('input', performCalculations);
  });

  function validateAndPrint() {
    const required = [
      {id: 'exp_nit', name: 'NIT del Exportador'},
      {id: 'exp_razon', name: 'Razón Social del Exportador'},
      {id: 'pais_destino', name: 'País de Destino (Casilla 38)'}
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

  // Init
  performCalculations();
</script>
</body>
</html>
"""

with open(path, "w") as f:
    f.write(html_head)
    f.write(body_content)
    f.write(scripts)

print("Formulario 600 generated successfully.")
