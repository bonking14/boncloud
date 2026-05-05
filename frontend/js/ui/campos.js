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
    transporte: `<div class="input-group"><label>Transporte interno (COP)</label><input type="number" step="0.01" id="transporte" placeholder="Ej: 300000" min="0"></div>`
};