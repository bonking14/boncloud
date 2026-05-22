// ============================================================
//  BonCloud — Incoterms 2020  |  Modal con animación canvas
// ============================================================

const incoterms = [
  {
    code: 'EXW', nombre: 'Ex Works', lugar: 'En fábrica del vendedor',
    tipo: ['multimodal', 'comprador'],
    desc: 'El vendedor pone la mercancía a disposición en sus instalaciones. El comprador asume absolutamente todos los costos y riesgos desde ese punto.',
    // riskPoint: fracción 0-1 donde la bandera cambia de mano
    riskPoint: 0.05,
    // etapas que paga el vendedor (para colorear el camino)
    vendedorHasta: 0.05,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'Poco usado en Colombia — el comprador extranjero debe gestionar la exportación ante la DIAN.',
    responsabilidades: {
      'Transporte origen':'Comprador','Aduana exportación':'Comprador',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FCA', nombre: 'Free Carrier', lugar: 'Transportista en origen',
    tipo: ['multimodal'],
    desc: 'El vendedor entrega al transportista designado por el comprador en el lugar acordado. Flexible, ideal para contenedores.',
    riskPoint: 0.22, vendedorHasta: 0.22,
    etapas: ['Fábrica','Transportista','Océano','Puerto destino','Almacén'],
    notaCO: 'Recomendado por la ICC como sustituto moderno de FOB para contenedores.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FAS', nombre: 'Free Alongside Ship', lugar: 'Al costado del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega al costado del buque en el puerto de origen. Solo marítimo/fluvial.',
    riskPoint: 0.35, vendedorHasta: 0.35,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'Usado en Barranquilla y Cartagena para exportaciones a granel.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FOB', nombre: 'Free On Board', lugar: 'A bordo del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega a bordo del buque en el puerto de origen. El más usado en Colombia.',
    riskPoint: 0.42, vendedorHasta: 0.42,
    etapas: ['Fábrica','Puerto origen','A bordo','Puerto destino','Almacén'],
    notaCO: '⭐ El más común en Colombia. Base frecuente del Formulario 500.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CFR', nombre: 'Cost and Freight', lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'Vendedor paga el flete hasta puerto destino. El riesgo pasa al comprador al embarcar. El comprador contrata el seguro.',
    riskPoint: 0.42, vendedorHasta: 0.75,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'El importador colombiano contrata el seguro directamente.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CIF', nombre: 'Cost, Insurance & Freight', lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'Vendedor paga flete y seguro hasta puerto destino. Base de cálculo para tributos aduaneros en Colombia.',
    riskPoint: 0.42, vendedorHasta: 0.75,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: '⭐ El valor CIF es la base para calcular arancel + IVA ante la DIAN.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CPT', nombre: 'Carriage Paid To', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Vendedor paga el transporte hasta el destino. El riesgo pasa al primer transportista en origen.',
    riskPoint: 0.22, vendedorHasta: 0.82,
    etapas: ['Fábrica','Transportista','Tránsito','Destino','Almacén'],
    notaCO: 'Alternativa multimodal a CFR para carga aérea o combinada.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'CIP', nombre: 'Carriage & Insurance Paid', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Vendedor paga transporte y seguro amplio (ICC-A). Riesgo pasa al primer transportista en origen.',
    riskPoint: 0.22, vendedorHasta: 0.82,
    etapas: ['Fábrica','Transportista','Tránsito','Destino','Almacén'],
    notaCO: 'Ideal para exportar productos de alto valor desde Cartagena vía multimodal.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DAP', nombre: 'Delivered At Place', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Vendedor asume todo hasta el lugar de destino listo para descarga. Comprador paga aduana de importación.',
    riskPoint: 0.88, vendedorHasta: 0.88,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Destino'],
    notaCO: 'El importador colombiano paga arancel + IVA y la descarga.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DPU', nombre: 'Delivered at Place Unloaded', lugar: 'Terminal de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Único Incoterm donde el vendedor asume el costo de descarga en destino.',
    riskPoint: 0.93, vendedorHasta: 0.93,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Descarga'],
    notaCO: 'El único Incoterm donde el vendedor asume el riesgo de descarga en destino.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DDP', nombre: 'Delivered Duty Paid', lugar: 'Destino final',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor asume absolutamente todo, incluyendo aranceles e impuestos de importación.',
    riskPoint: 0.98, vendedorHasta: 0.98,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'El vendedor extranjero gestiona la importación ante la DIAN. Muy exigente.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Vendedor','Transporte destino':'Vendedor'
    }
  }
];

const columnas = ['Transporte origen','Aduana exportación','Flete internacional','Seguro','Aduana importación','Transporte destino'];

// ── estilos dinámicos ─────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
.incoterm-card { cursor:pointer; transition: border-color .2s, transform .15s; }
.incoterm-card:hover { border-color:#2a4a7f; transform:translateY(-1px); }
.incoterm-card-header { display:flex; align-items:flex-start; gap:10px; }
.inc-chevron { margin-left:auto; font-size:10px; color:#374151; flex-shrink:0; padding-top:2px; }

/* Modal overlay */
#inc-modal-overlay {
  display:none; position:fixed; inset:0;
  background:rgba(0,0,0,.75); z-index:2000;
  align-items:center; justify-content:center;
}
#inc-modal-overlay.open { display:flex; }

#inc-modal {
  background:#0f1117; border:1px solid #1a1f2e; border-radius:14px;
  width:min(860px,95vw); max-height:92vh; overflow-y:auto;
  padding:24px; position:relative;
  animation: modalIn .25s ease;
}
@keyframes modalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }

#inc-modal-close {
  position:absolute; top:14px; right:16px;
  background:none; border:none; color:#4b5563;
  font-size:18px; cursor:pointer; line-height:1;
}
#inc-modal-close:hover { color:#c9d1dc; }

.modal-top { display:flex; align-items:flex-start; gap:14px; margin-bottom:16px; }
.modal-code-badge {
  background:#172035; color:#4a7fd4;
  padding:6px 14px; border-radius:7px;
  font-size:16px; font-weight:700; white-space:nowrap;
}
.modal-title-block strong { display:block; font-size:15px; color:#c9d1dc; margin-bottom:3px; }
.modal-title-block span { font-size:12px; color:#4b5563; }
.modal-desc { font-size:12px; color:#6b7280; line-height:1.6; margin-bottom:16px; }

/* Canvas scene */
#inc-canvas {
  width:100%; border-radius:10px;
  background:#0a0f18; display:block;
  border:1px solid #1a1f2e; margin-bottom:16px;
}

/* Controles animación */
.anim-controls {
  display:flex; align-items:center; gap:10px; margin-bottom:16px;
}
.btn-anim {
  background:#172035; color:#4a7fd4; border:1px solid #2a4a7f;
  padding:6px 16px; border-radius:6px; font-size:12px; cursor:pointer;
  transition:background .2s;
}
.btn-anim:hover { background:#1e3a5f; }
.anim-speed { font-size:11px; color:#4b5563; margin-left:auto; }
input[type=range]#anim-speed-slider { width:80px; accent-color:#4a7fd4; }

/* Etapa actual */
.etapa-badge {
  background:#13161f; border:1px solid #1a1f2e; border-radius:6px;
  padding:7px 14px; font-size:12px; color:#c9d1dc;
  display:flex; align-items:center; gap:8px; margin-bottom:16px;
}
.etapa-dot { width:8px; height:8px; border-radius:50%; background:#4a7fd4; flex-shrink:0; }

/* Tabla responsabilidades modal */
.modal-resp { display:grid; grid-template-columns:1fr 1fr; gap:4px 20px; margin-bottom:14px; }
.modal-resp-row { display:flex; justify-content:space-between; font-size:11px; padding:3px 0; border-bottom:1px solid #13161f; color:#6b7280; }
.modal-resp-row:last-child { border-bottom:none; }
.rv { color:#4a7f6a; font-weight:500; }
.rc { color:#7a4f4f; font-weight:500; }

.nota-co { font-size:11px; color:#4a7f6a; background:#0a1a12; border:1px solid #1a2e1f; border-radius:6px; padding:8px 12px; }
`;
document.head.appendChild(style);

// ── Modal HTML ────────────────────────────────────────────
const overlay = document.createElement('div');
overlay.id = 'inc-modal-overlay';
overlay.innerHTML = `
  <div id="inc-modal">
    <button id="inc-modal-close">✕</button>
    <div class="modal-top">
      <div class="modal-code-badge" id="m-code"></div>
      <div class="modal-title-block">
        <strong id="m-nombre"></strong>
        <span id="m-lugar"></span>
      </div>
    </div>
    <p class="modal-desc" id="m-desc"></p>
    <canvas id="inc-canvas" height="260"></canvas>
    <div class="anim-controls">
      <button class="btn-anim" id="btn-play">⏸ Pausar</button>
      <button class="btn-anim" id="btn-restart">↺ Reiniciar</button>
      <span class="anim-speed">Velocidad</span>
      <input type="range" id="anim-speed-slider" min="0.3" max="3" step="0.1" value="1">
    </div>
    <div class="etapa-badge"><div class="etapa-dot"></div><span id="m-etapa">Iniciando...</span></div>
    <div class="modal-resp" id="m-resp"></div>
    <div class="nota-co" id="m-nota"></div>
  </div>
`;
document.body.appendChild(overlay);

// ── Cerrar modal ──────────────────────────────────────────
document.getElementById('inc-modal-close').onclick = cerrarModal;
overlay.addEventListener('click', e => { if(e.target === overlay) cerrarModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') cerrarModal(); });

function cerrarModal() {
  overlay.classList.remove('open');
  cancelAnimationFrame(animRAF);
  animRAF = null;
}

// ── Variables animación ───────────────────────────────────
let animRAF = null;
let animT = 0;       // 0..1 progreso total
let animPaused = false;
let animSpeed = 1;
let currentInc = null;

document.getElementById('btn-play').onclick = () => {
  animPaused = !animPaused;
  document.getElementById('btn-play').textContent = animPaused ? '▶ Reanudar' : '⏸ Pausar';
  if(!animPaused && animRAF === null) loopAnim();
};
document.getElementById('btn-restart').onclick = () => {
  animT = 0; animPaused = false;
  document.getElementById('btn-play').textContent = '⏸ Pausar';
  cancelAnimationFrame(animRAF); animRAF = null;
  loopAnim();
};
document.getElementById('anim-speed-slider').oninput = function(){ animSpeed = parseFloat(this.value); };

// ── Abrir modal ───────────────────────────────────────────
function abrirModal(inc) {
  currentInc = inc;
  cancelAnimationFrame(animRAF); animRAF = null;
  animT = 0; animPaused = false;
  document.getElementById('btn-play').textContent = '⏸ Pausar';

  document.getElementById('m-code').textContent   = inc.code;
  document.getElementById('m-nombre').textContent = inc.nombre;
  document.getElementById('m-lugar').textContent  = inc.lugar;
  document.getElementById('m-desc').textContent   = inc.desc;
  document.getElementById('m-nota').textContent   = inc.notaCO;

  const resp = document.getElementById('m-resp');
  resp.innerHTML = Object.entries(inc.responsabilidades).map(([k,v])=>`
    <div class="modal-resp-row"><span>${k}</span><span class="${v==='Vendedor'?'rv':'rc'}">${v}</span></div>
  `).join('');

  overlay.classList.add('open');

  // Ajustar canvas a ancho real
  const canvas = document.getElementById('inc-canvas');
  canvas.width  = canvas.offsetWidth || 800;
  canvas.height = 260;

  loopAnim();
}

// ── Loop de animación ─────────────────────────────────────
function loopAnim() {
  if(!currentInc) return;
  const canvas = document.getElementById('inc-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  drawScene(ctx, W, H, animT, currentInc);

  if(!animPaused) {
    animT += 0.0018 * animSpeed;
    if(animT > 1.08) animT = 0; // loop
  }

  animRAF = requestAnimationFrame(loopAnim);
}

// ── Dibuja la escena completa ─────────────────────────────
function drawScene(ctx, W, H, t, inc) {
  const tc = Math.min(t, 1);
  ctx.clearRect(0, 0, W, H);

  // Cielo degradado
  const sky = ctx.createLinearGradient(0,0,0,H*0.65);
  sky.addColorStop(0,'#050d1a');
  sky.addColorStop(1,'#0a1628');
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H*0.65);

  // Mar
  const sea = ctx.createLinearGradient(0,H*0.55,0,H*0.75);
  sea.addColorStop(0,'#0a2040');
  sea.addColorStop(1,'#061428');
  ctx.fillStyle = sea;
  ctx.fillRect(0,H*0.55,W,H*0.2);

  // Olas animadas
  drawWaves(ctx, W, H, t);

  // Suelo
  const ground = ctx.createLinearGradient(0,H*0.72,0,H);
  ground.addColorStop(0,'#111827');
  ground.addColorStop(1,'#0d0d13');
  ctx.fillStyle = ground;
  ctx.fillRect(0,H*0.72,W,H*0.28);

  // Carretera
  ctx.fillStyle = '#1a1f2e';
  ctx.fillRect(0,H*0.73,W,H*0.05);
  // líneas carretera
  ctx.strokeStyle='#374151'; ctx.lineWidth=1.5; ctx.setLineDash([18,14]);
  ctx.beginPath(); ctx.moveTo(0,H*0.755); ctx.lineTo(W,H*0.755); ctx.stroke();
  ctx.setLineDash([]);

  // Posiciones fijas
  const fabX  = W*0.06;
  const portOX = W*0.30;
  const midX   = W*0.50;
  const portDX = W*0.70;
  const almX   = W*0.94;
  const groundY = H*0.73;
  const seaY    = H*0.62;

  // Edificios
  drawFabrica(ctx, fabX, groundY, H, '#1e3a5f', 'VENDEDOR');
  drawAlmacen(ctx, almX, groundY, H, '#3a1a1a', 'COMPRADOR');
  drawPuerto(ctx, portOX, groundY, H, '#1a2e1f', 'Puerto\nOrigen');
  drawPuerto(ctx, portDX, groundY, H, '#2e1a1a', 'Puerto\nDestino');

  // Ruta en el suelo
  drawRoad(ctx, fabX+30, portOX-10, groundY-2, tc, inc.vendedorHasta, 0, 0.30);
  drawRoad(ctx, portDX+10, almX-30, groundY-2, tc, inc.vendedorHasta, 0.70, 1.0);

  // Ruta marítima
  drawSeaRoute(ctx, portOX+10, portDX-10, seaY, tc, inc.vendedorHasta, 0.30, 0.70);

  // Camión (tierra)
  if(tc < 0.30) {
    const cx = lerp(fabX+35, portOX-15, tc/0.30);
    drawTruck(ctx, cx, groundY-2, false);
  }
  if(tc > 0.70 && tc < 1.0) {
    const cx = lerp(portDX+15, almX-35, (tc-0.70)/0.30);
    drawTruck(ctx, cx, groundY-2, false);
  }

  // Barco
  if(tc >= 0.28 && tc <= 0.72) {
    const bx = lerp(portOX+20, portDX-20, (tc-0.28)/0.44);
    drawShip(ctx, bx, seaY, t);
  }

  // Bandera de riesgo (sigue al vehículo activo)
  const flagPos = getFlagPos(tc, inc, fabX, portOX, portDX, almX, groundY, seaY);
  drawFlag(ctx, flagPos.x, flagPos.y, tc < inc.riskPoint, t);

  // Línea vertical de transferencia de riesgo
  const riskX = lerp(fabX+35, almX-35, inc.riskPoint);
  drawRiskLine(ctx, riskX, H*0.1, H*0.85, tc >= inc.riskPoint);

  // Halo de riesgo en el punto de transferencia
  if(Math.abs(tc - inc.riskPoint) < 0.04) {
    const pulse = 0.5 + 0.5*Math.sin(t*18);
    ctx.beginPath();
    ctx.arc(riskX, H*0.5, 18+pulse*10, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,200,50,${0.6+pulse*0.4})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Estrellas
  drawStars(ctx, W, H, t);

  // Etiqueta de etapa
  const etapa = getEtapa(tc, inc);
  document.getElementById('m-etapa').textContent = etapa;

  // HUD superior
  drawHUD(ctx, W, H, tc, inc);
}

// ── Utilidades de dibujo ──────────────────────────────────

function lerp(a,b,t){ return a+(b-a)*Math.max(0,Math.min(1,t)); }

function drawWaves(ctx,W,H,t){
  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.strokeStyle=`rgba(74,127,212,${0.12+i*0.05})`;
    ctx.lineWidth=1;
    for(let x=0;x<=W;x+=4){
      const y=H*0.60 + Math.sin((x/80)+t*2+i*1.2)*4 + i*5;
      i===0&&x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
}

function drawStars(ctx,W,H,t){
  const stars=[[50,20],[120,15],[200,30],[300,10],[400,25],[500,18],[600,12],[700,28],[800,8]];
  stars.forEach(([x,y],i)=>{
    const b=0.4+0.4*Math.sin(t*1.5+i);
    ctx.beginPath();
    ctx.arc(x*(W/860),y*(H/260),1,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${b})`;
    ctx.fill();
  });
}

function drawFabrica(ctx,x,groundY,H,color,label){
  const w=54,h=70;
  // Edificio principal
  ctx.fillStyle='#0f1117';
  ctx.strokeStyle=color;
  ctx.lineWidth=1.5;
  roundRect(ctx,x-w/2,groundY-h,w,h,4);
  ctx.fill(); ctx.stroke();
  // Ventanas
  for(let r=0;r<3;r++) for(let c=0;c<2;c++){
    ctx.fillStyle='rgba(74,127,212,0.3)';
    roundRect(ctx,x-18+c*22,groundY-h+10+r*20,14,12,2);
    ctx.fill();
  }
  // Chimenea
  ctx.fillStyle='#1a1f2e'; ctx.strokeStyle=color; ctx.lineWidth=1;
  roundRect(ctx,x+8,groundY-h-18,10,20,2); ctx.fill(); ctx.stroke();
  // Humo
  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.arc(x+13,groundY-h-22-i*8,3+i,0,Math.PI*2);
    ctx.fillStyle=`rgba(100,110,130,${0.3-i*0.08})`;
    ctx.fill();
  }
  // Label
  ctx.fillStyle='#4a7fd4'; ctx.font='bold 9px Segoe UI';
  ctx.textAlign='center'; ctx.fillText(label,x,groundY+12);
}

function drawAlmacen(ctx,x,groundY,H,color,label){
  const w=54,h=55;
  ctx.fillStyle='#0f1117'; ctx.strokeStyle=color; ctx.lineWidth=1.5;
  roundRect(ctx,x-w/2,groundY-h,w,h,4); ctx.fill(); ctx.stroke();
  // Puerta
  ctx.fillStyle='rgba(122,79,79,0.4)';
  roundRect(ctx,x-8,groundY-22,16,22,2); ctx.fill();
  // Ventanas
  for(let c=0;c<2;c++){
    ctx.fillStyle='rgba(122,79,79,0.3)';
    roundRect(ctx,x-20+c*28,groundY-h+10,12,10,2); ctx.fill();
  }
  ctx.fillStyle='#7a4f4f'; ctx.font='bold 9px Segoe UI';
  ctx.textAlign='center'; ctx.fillText(label,x,groundY+12);
}

function drawPuerto(ctx,x,groundY,H,color,label){
  // Grúa
  ctx.strokeStyle=color; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x,groundY); ctx.lineTo(x,groundY-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,groundY-50); ctx.lineTo(x+28,groundY-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+28,groundY-50); ctx.lineTo(x+28,groundY-30); ctx.stroke();
  // Cable
  ctx.strokeStyle='rgba(100,120,150,0.6)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+28,groundY-30); ctx.lineTo(x+28,groundY-14); ctx.stroke();
  // Base
  ctx.fillStyle=color; roundRect(ctx,x-6,groundY-10,12,10,2); ctx.fill();
  // Label
  ctx.fillStyle='#6b7280'; ctx.font='9px Segoe UI'; ctx.textAlign='center';
  label.split('\n').forEach((l,i)=>ctx.fillText(l,x,groundY+12+i*11));
}

function drawTruck(ctx,x,y,mirror){
  ctx.save();
  if(mirror){ ctx.translate(x,0); ctx.scale(-1,1); ctx.translate(-x,0); }
  // Cabina
  ctx.fillStyle='#1e3a5f'; ctx.strokeStyle='#4a7fd4'; ctx.lineWidth=1;
  roundRect(ctx,x-6,y-22,14,18,3); ctx.fill(); ctx.stroke();
  // Parabrisas
  ctx.fillStyle='rgba(74,127,212,0.4)';
  roundRect(ctx,x-4,y-21,10,8,2); ctx.fill();
  // Carga
  ctx.fillStyle='#172035'; ctx.strokeStyle='#2a4a7f'; ctx.lineWidth=1;
  roundRect(ctx,x-22,y-19,18,15,2); ctx.fill(); ctx.stroke();
  // Ruedas
  [x-16,x-3,x+5].forEach(wx=>{
    ctx.beginPath(); ctx.arc(wx,y-2,5,0,Math.PI*2);
    ctx.fillStyle='#0d0d13'; ctx.strokeStyle='#374151'; ctx.lineWidth=1;
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx,y-2,2,0,Math.PI*2);
    ctx.fillStyle='#1a1f2e'; ctx.fill();
  });
  ctx.restore();
}

function drawShip(ctx,x,y,t){
  const bob = Math.sin(t*2)*2;
  y += bob;
  // Casco
  ctx.beginPath();
  ctx.moveTo(x-32,y+6);
  ctx.lineTo(x+32,y+6);
  ctx.lineTo(x+28,y+16);
  ctx.lineTo(x-28,y+16);
  ctx.closePath();
  ctx.fillStyle='#1e3a5f'; ctx.strokeStyle='#4a7fd4'; ctx.lineWidth=1.5;
  ctx.fill(); ctx.stroke();
  // Superestructura
  ctx.fillStyle='#172035'; ctx.strokeStyle='#2a4a7f'; ctx.lineWidth=1;
  roundRect(ctx,x-14,y-14,28,20,3); ctx.fill(); ctx.stroke();
  // Chimenea barco
  ctx.fillStyle='#4a7fd4';
  roundRect(ctx,x-4,y-22,8,10,2); ctx.fill();
  // Ventanas barco
  for(let i=0;i<3;i++){
    ctx.beginPath(); ctx.arc(x-10+i*10,y-6,2.5,0,Math.PI*2);
    ctx.fillStyle='rgba(74,127,212,0.5)'; ctx.fill();
  }
  // Contenedor en cubierta
  ctx.fillStyle='#4a7f6a'; ctx.strokeStyle='#2a5f4a'; ctx.lineWidth=1;
  roundRect(ctx,x-20,y-2,14,10,1); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#7a4f4f'; ctx.strokeStyle='#5f2a2a'; ctx.lineWidth=1;
  roundRect(ctx,x+4,y-2,14,10,1); ctx.fill(); ctx.stroke();
}

function drawFlag(ctx,x,y,esVendedor,t){
  const wave = Math.sin(t*6)*4;
  // Mástil
  ctx.strokeStyle='#c9d1dc'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-28); ctx.stroke();
  // Bandera
  ctx.beginPath();
  ctx.moveTo(x,y-28);
  ctx.lineTo(x+18+wave,y-22);
  ctx.lineTo(x,y-16);
  ctx.closePath();
  ctx.fillStyle = esVendedor ? '#4a7fd4' : '#7a4f4f';
  ctx.fill();
  // Texto en bandera
  ctx.fillStyle='#fff'; ctx.font='bold 6px Segoe UI'; ctx.textAlign='center';
  ctx.fillText(esVendedor?'V':'C', x+8+wave/2, y-21);
}

function drawRoad(ctx,x1,x2,y,tc,vendedorHasta,segStart,segEnd){
  const prog = Math.max(0,Math.min(1,(tc-segStart)/(segEnd-segStart)));
  const coveredX = lerp(x1,x2,prog);
  const isVendedor = vendedorHasta >= (segStart+segEnd)/2;
  // Recorrido hecho
  ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(coveredX,y);
  ctx.strokeStyle = isVendedor ? 'rgba(74,127,212,0.7)' : 'rgba(122,79,79,0.7)';
  ctx.lineWidth=3; ctx.stroke();
  // Pendiente
  ctx.beginPath(); ctx.moveTo(coveredX,y); ctx.lineTo(x2,y);
  ctx.strokeStyle='rgba(55,65,81,0.4)'; ctx.lineWidth=3; ctx.stroke();
}

function drawSeaRoute(ctx,x1,x2,y,tc,vendedorHasta,segStart,segEnd){
  const prog = Math.max(0,Math.min(1,(tc-segStart)/(segEnd-segStart)));
  const coveredX = lerp(x1,x2,prog);
  const midSeg = (segStart+segEnd)/2;
  const isVendedor = vendedorHasta >= midSeg;
  ctx.setLineDash([6,4]);
  ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(coveredX,y);
  ctx.strokeStyle = isVendedor ? 'rgba(74,127,212,0.5)' : 'rgba(122,79,79,0.5)';
  ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(coveredX,y); ctx.lineTo(x2,y);
  ctx.strokeStyle='rgba(55,65,81,0.25)'; ctx.lineWidth=2; ctx.stroke();
  ctx.setLineDash([]);
}

function drawRiskLine(ctx,x,y1,y2,passed){
  ctx.save();
  ctx.strokeStyle = passed ? 'rgba(122,79,79,0.5)' : 'rgba(255,200,50,0.7)';
  ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(x,y1); ctx.lineTo(x,y2); ctx.stroke();
  ctx.setLineDash([]);
  // Etiqueta
  ctx.fillStyle = passed ? 'rgba(122,79,79,0.8)' : 'rgba(255,200,50,0.9)';
  ctx.font='bold 8px Segoe UI'; ctx.textAlign='center';
  ctx.fillText('⚡ RIESGO', x, y1-4);
  ctx.restore();
}

function drawHUD(ctx,W,H,tc,inc){
  // Barra de progreso total
  const bw=W*0.6, bx=(W-bw)/2, by=H-18;
  ctx.fillStyle='rgba(26,31,46,0.8)';
  roundRect(ctx,bx-6,by-6,bw+12,16,4); ctx.fill();
  // Fondo
  ctx.fillStyle='#1a1f2e';
  roundRect(ctx,bx,by,bw,6,3); ctx.fill();
  // Vendedor
  const vEnd = Math.min(tc, inc.vendedorHasta);
  ctx.fillStyle='#4a7fd4';
  roundRect(ctx,bx,by,bw*vEnd,6,3); ctx.fill();
  // Comprador (después del riskPoint)
  if(tc > inc.riskPoint){
    ctx.fillStyle='#7a4f4f';
    roundRect(ctx,bx+bw*inc.riskPoint,by,bw*(tc-inc.riskPoint),6,3); ctx.fill();
  }
  // Marcador de riesgo
  ctx.fillStyle='#fbbf24';
  roundRect(ctx,bx+bw*inc.riskPoint-1,by-2,2,10,1); ctx.fill();
  // Labels HUD
  ctx.fillStyle='#4a7fd4'; ctx.font='bold 8px Segoe UI'; ctx.textAlign='left';
  ctx.fillText('Vendedor',bx,by-8);
  ctx.fillStyle='#7a4f4f'; ctx.textAlign='right';
  ctx.fillText('Comprador',bx+bw,by-8);
}

function getFlagPos(tc,inc,fabX,portOX,portDX,almX,groundY,seaY){
  // Bandera sigue al vehículo activo
  if(tc < 0.28){
    const x = lerp(fabX+35, portOX-15, tc/0.28);
    return {x, y: groundY-28};
  } else if(tc < 0.72){
    const x = lerp(portOX+20, portDX-20, (tc-0.28)/0.44);
    return {x, y: seaY-20};
  } else {
    const x = lerp(portDX+15, almX-35, (tc-0.72)/0.28);
    return {x, y: groundY-28};
  }
}

function getEtapa(tc,inc){
  const etapas = inc.etapas;
  const breaks = [0, 0.28, 0.50, 0.72, 1.0];
  for(let i=0;i<breaks.length-1;i++){
    if(tc >= breaks[i] && tc < breaks[i+1]) return `Etapa ${i+1}/5: ${etapas[i]}`;
  }
  return `Etapa 5/5: ${etapas[4]}`;
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// ── Render de tarjetas ────────────────────────────────────
let filtroActivo = 'todos';

function renderCards(filtro){
  filtroActivo = filtro;
  const grid = document.getElementById('incoterms-grid');
  grid.innerHTML = '';
  const filtrados = filtro==='todos' ? incoterms : incoterms.filter(i=>i.tipo.includes(filtro));

  filtrados.forEach(inc=>{
    const tags = inc.tipo.map(t=>`<span class="tag tag-${t}">${t}</span>`).join('');
    const resps = Object.entries(inc.responsabilidades).map(([k,v])=>{
      const cls = v==='Vendedor'?'resp-vendedor':'resp-comprador';
      return `<div class="resp-row"><span>${k}</span><span class="${cls}">${v}</span></div>`;
    }).join('');

    const div = document.createElement('div');
    div.className = 'incoterm-card';
    div.innerHTML = `
      <div class="incoterm-card-header">
        <div class="incoterm-code">${inc.code}</div>
        <div class="incoterm-name">
          <strong>${inc.nombre}</strong>${inc.lugar}
        </div>
        <div class="inc-chevron">▶ Ver animación</div>
      </div>
      <p class="incoterm-desc">${inc.desc}</p>
      <div class="incoterm-tags">${tags}</div>
      <div class="responsabilidad">${resps}</div>`;
    div.onclick = () => abrirModal(inc);
    grid.appendChild(div);
  });
}

function renderTabla(){
  const tbody = document.getElementById('tabla-body');
  incoterms.forEach(inc=>{
    const celdas = columnas.map(col=>{
      const v = inc.responsabilidades[col];
      const cls = v==='Vendedor'?'celda-v':v==='Comprador'?'celda-c':'celda-n';
      return `<td class="${cls}">${v}</td>`;
    }).join('');
    tbody.innerHTML += `<tr><td><strong style="color:#4a7fd4">${inc.code}</strong></td>${celdas}</tr>`;
  });
}

document.querySelectorAll('.filtro-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filtro-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});

renderCards('todos');
renderTabla();