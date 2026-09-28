const bancoQuizzes = {
  incoterms: [
    {
      pregunta: "¿Bajo qué Incoterm el comprador asume la máxima responsabilidad y todos los costos desde la fábrica del vendedor?",
      opciones: ["DDP", "EXW", "FOB", "CIF"],
      correcta: 1,
      explicacion: "EXW (Ex Works) obliga al comprador a realizar la carga, flete internacional, seguro y aduanas desde las instalaciones del vendedor."
    },
    {
      pregunta: "En una compra con Incoterm CIF Cartagena, ¿quién está obligado a contratar y pagar el seguro marítimo?",
      opciones: ["El comprador", "La agencia de aduanas", "El vendedor", "La sociedad portuaria"],
      correcta: 2,
      explicacion: "En CIF (Cost, Insurance and Freight), el vendedor paga el flete marítimo y la cobertura básica de seguro hasta el puerto de destino."
    },
    {
      pregunta: "¿Cuál de los siguientes Incoterms es exclusivo para transporte marítimo y vías navegables?",
      opciones: ["FCA", "CPT", "FOB", "DAP"],
      correcta: 2,
      explicacion: "FOB (Free On Board) aplica únicamente cuando la mercancía se entrega a bordo de un buque marítimo o fluvial."
    },
    {
      pregunta: "¿Qué Incoterm requiere que el vendedor pague los tributos aduaneros (arancel e IVA) en el país de destino?",
      opciones: ["DDP", "DPU", "CIF", "FCA"],
      correcta: 0,
      explicacion: "DDP (Delivered Duty Paid) es el único Incoterm donde el vendedor asume la liquidación y pago de tributos aduaneros en destino."
    },
    {
      pregunta: "¿En qué momento se transfiere el riesgo de pérdida en el Incoterm FOB?",
      opciones: ["Al llegar a la bodega del comprador", "Cuando la carga está a bordo del buque en el puerto de embarque", "Al firmar la factura comercial", "Al pagar la declaración de importación"],
      correcta: 1,
      explicacion: "El riesgo se transmite del vendedor al comprador una vez la carga reposa a bordo del barco designado."
    }
  ],
  subpartidas: [
    {
      pregunta: "¿Cuántos dígitos tiene la subpartida arancelaria del arancel colombiano (NANDINA)?",
      opciones: ["6 dígitos", "8 dígitos", "10 dígitos", "12 dígitos"],
      correcta: 2,
      explicacion: "En Colombia y la Comunidad Andina se utiliza la nomenclatura a 10 dígitos para definir aranceles e impuestos exactos."
    },
    {
      pregunta: "¿Sobre qué valor en pesos (COP) se calcula el impuesto de arancel en una importación ordinaria?",
      opciones: ["Valor FOB en USD", "Valor CIF convertido a COP con la TRM", "Precio de venta en Colombia", "Valor del seguro únicamente"],
      correcta: 1,
      explicacion: "La base gravable del arancel en Colombia es el Valor CIF (FOB + Flete + Seguro) expresado en COP a la TRM oficial."
    },
    {
      pregunta: "¿Cuál es la tarifa general del IVA de importación en Colombia sobre la base gravable?",
      opciones: ["0%", "5%", "19%", "35%"],
      correcta: 2,
      explicacion: "El IVA general de importación es el 19%, calculado sobre (Base CIF en COP + Arancel en COP)."
    },
    {
      pregunta: "Si una subpartida arancelaria cuenta con un Tratado de Libre Comercio (TLC) vigente, ¿qué beneficio puede obtener?",
      opciones: ["Exención total de IVA automáticamente", "Desgravación o reducción del Arancel Ad-Valorem", "No requerir factura comercial", "Eliminación de fletes marítimos"],
      correcta: 1,
      explicacion: "Los TLC reducen o eliminan el arancel mediante presentación del Certificado de Origen válido."
    },
    {
      pregunta: "¿Qué documento de la nomenclatura define las descripciones y notas legales de cada partida arancelaria?",
      opciones: ["El Decreto de Arancel de Aduanas", "El Bill of Lading", "El RUT tributario", "La factura proforma"],
      correcta: 0,
      explicacion: "El Arancel de Aduanas oficial reglamenta las partidas, notas de sección y tarifas ad-valorem."
    }
  ],
  vistos_buenos: [
    {
      pregunta: "¿Qué entidad en Colombia expide los registros sanitarios para la importación de alimentos y medicamentos?",
      opciones: ["ICA", "INVIMA", "SIC", "MinComercio"],
      correcta: 1,
      explicacion: "El INVIMA es la autoridad sanitaria encargada de la vigilancia de medicamentos, alimentos y cosméticos."
    },
    {
      pregunta: "¿Cuál es la entidad responsable de controlar la importación y exportación de productos agrícolas y pecuarios?",
      opciones: ["ICA", "ANLA", "AUNAP", "Superfinanciera"],
      correcta: 0,
      explicacion: "El Instituto Colombiano Agropecuario (ICA) supervisa la sanidad animal y vegetal para prevenir plagas."
    },
    {
      pregunta: "¿En qué plataforma electrónica del gobierno colombiano se tramitan las licencias y registros de importación con vistos buenos?",
      opciones: ["Muisca DIAN", "VUCE (Ventanilla Única de Comercio Exterior)", "RUNT", "SIMAT"],
      correcta: 1,
      explicacion: "La VUCE centraliza los trámites de registro y licencias de importación ante las distintas entidades del Estado."
    },
    {
      pregunta: "¿Qué sucede si una mercancía sujeta a Visto Bueno obligatorio llega a puerto colombiano sin el permiso previo?",
      opciones: ["Se otorga levante automático con multa de 10%", "No se permite el desaduanamiento y puede causar decomiso o reembarco", "El puerto asume el pago de arancel", "Se convierte en exportación gratuita"],
      correcta: 1,
      explicacion: "Los vistos buenos deben ser previos al embarque o presentación de la declaración; su falta impide el levante de aduana."
    },
    {
      pregunta: "¿Qué entidad vigila el cumplimiento de los reglamentos técnicos (RETIE, etiquetado) en productos manufacturados?",
      opciones: ["Superintendencia de Industria y Comercio (SIC)", "INVIMA", "MinMinas", "DANE"],
      correcta: 0,
      explicacion: "La SIC evalúa la conformidad técnica y reglamentos de etiquetado y seguridad de productos."
    }
  ],
  simulador: [
    {
      pregunta: "¿Qué elementos componen el valor CIF de una mercancía importada?",
      opciones: ["FOB + Gastos locales en Colombia", "FOB + Flete Internacional + Seguro", "Precio de venta + IVA", "Arancel + Bodegaje + Agenciamiento"],
      correcta: 1,
      explicacion: "CIF equivale a la suma del Valor FOB de origen + Flete Internacional + Seguro de transporte."
    },
    {
      pregunta: "¿Qué Tasa Representativa del Mercado (TRM) se utiliza para liquidar la declaración de importación?",
      opciones: ["La TRM proyectada a fin de año", "La TRM vigente en la fecha de presentación y pago de la declaración", "La TRM de la fecha en que se fabricó el producto", "Una tasa fija de $3.000 COP"],
      correcta: 1,
      explicacion: "La DIAN exige liquidar impuestos con la TRM oficial del día de presentación y pago de la declaración aduanera."
    },
    {
      pregunta: "¿Qué costo logístico surge si un contenedor sobrepasa los días libres concedidos por la naviera en puerto?",
      opciones: ["Flete de retorno", "Demora de contenedor (Demurrage)", "Sobretasa de IVA", "Comisión de agente de carga"],
      correcta: 1,
      explicacion: "La mora o demora de contenedor es la penalidad diaria por no devolver el contenedor vacío a tiempo."
    },
    {
      pregunta: "¿Qué documento acredita el contrato de transporte marítimo y la titularidad de la carga?",
      opciones: ["Bill of Lading (BL)", "Air Waybill (AWB)", "Factura de Venta", "Registro RUT"],
      correcta: 0,
      explicacion: "El BL (Bill of Lading) es el título valor y contrato de transporte marítimo de mercancías."
    },
    {
      pregunta: "¿Cuál es la función del agenciamiento aduanero en el proceso de importación?",
      opciones: ["Transportar físicamente el barco", "Representar al declarante en los trámites aduaneros ante la DIAN", "Fabricar los empaques de carga", "Prestar dinero para el pago de aranceles"],
      correcta: 1,
      explicacion: "Las Agencias de Aduanas (SIA) ejercen la intermediación aduanera declarando legalmente las mercancías."
    }
  ],
  formularios: [
    {
      pregunta: "¿Cuál es el formulario DIAN utilizado para la Declaración de Importación de mercancías a Colombia?",
      opciones: ["Formulario 001", "Formulario 500", "Formulario 600", "Formulario 560"],
      correcta: 1,
      explicacion: "El Formulario 500 es la Declaración de Importación oficial para nacionalizar mercancías en Colombia."
    },
    {
      pregunta: "¿Qué formulario soporta la determinación del Valor en Aduana cuando la importación supera los USD $5.000?",
      opciones: ["Formulario 560 (DAV)", "Formulario 600 (DEX)", "Formulario 001 (RUT)", "Formulario DTA"],
      correcta: 0,
      explicacion: "El Formulario 560 es la Declaración Andina del Valor (DAV), obligatoria para declarar elementos del precio de importación."
    },
    {
      pregunta: "¿Qué casilla del Formulario 001 RUT identifica el código tributario del contribuyente?",
      opciones: ["Casilla 5 - Número de Identificación Tributaria (NIT)", "Casilla 24 - Dirección", "Casilla 53 - Código de Responsabilidad", "Casilla 100 - Firma"],
      correcta: 0,
      explicacion: "La casilla 5 del RUT contiene el NIT que individualiza a la persona o empresa importadora/exportadora."
    },
    {
      pregunta: "¿Qué documento formaliza la salida definitiva de mercancías nacionales al exterior en el Formulario 600?",
      opciones: ["Declaración de Importación 500", "Declaración de Exportación (DEX)", "Conocimiento de embarque", "Factura proforma"],
      correcta: 1,
      explicacion: "El Formulario 600 DEX ampara la exportación de mercancías fuera del territorio aduanero nacional."
    },
    {
      pregunta: "¿Qué ampara el Formulario de Tránsito Aduanero (DTA)?",
      opciones: ["El pago de impuestos en el país de origen", "El transporte de mercancías entre dos aduanas nacionales con tributos suspendidos", "El registro sanitario de alimentos", "El seguro marítimo de carga"],
      correcta: 1,
      explicacion: "El DTA permite trasladar carga bajo control de la DIAN sin nacionalizarla ni pagar impuestos inmediatamente."
    }
  ]
};

let quizActual = null;
let indicePregunta = 0;
let puntaje = 0;
let respSeleccionada = null;

function iniciarQuizModal(moduloKey) {
  const preguntas = bancoQuizzes[moduloKey];
  if (!preguntas || preguntas.length === 0) return;

  quizActual = { key: moduloKey, preguntas };
  indicePregunta = 0;
  puntaje = 0;
  respSeleccionada = null;

  renderQuizModal();
}

function renderQuizModal() {
  let overlay = document.getElementById('quiz-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'quiz-modal-overlay';
    overlay.className = 'glosario-modal-overlay';
    overlay.innerHTML = `<div class="glosario-modal" id="quiz-modal-box" style="max-width:650px;"></div>`;
    document.body.appendChild(overlay);
  }

  const box = document.getElementById('quiz-modal-box');
  const q = quizActual.preguntas[indicePregunta];
  const total = quizActual.preguntas.length;

  box.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
      <span class="glosario-badge">📝 Evaluación de Módulo</span>
      <span style="font-size:0.85rem; color:var(--text-muted);">Pregunta ${indicePregunta + 1} de ${total}</span>
    </div>
    
    <h3 style="font-size:1.15rem; color:var(--text-primary); margin-bottom:1.25rem; line-height:1.5;">${q.pregunta}</h3>

    <div id="quiz-opciones" style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.25rem;">
      ${q.opciones.map((op, idx) => `
        <button class="quiz-opcion-btn" data-idx="${idx}" onclick="seleccionarRespuestaQuiz(${idx})" style="
          text-align:left; background:var(--bg-panel); border:1px solid var(--border);
          color:var(--text-secondary); padding:0.8rem 1rem; border-radius:8px;
          cursor:pointer; font-size:0.95rem; transition:all 0.2s; display:flex; align-items:center; gap:0.6rem;
        ">
          <span style="display:inline-block; width:22px; height:22px; border-radius:50%; border:1px solid var(--border-accent); text-align:center; line-height:20px; font-size:0.8rem; font-weight:bold; color:var(--text-accent);">
            ${String.fromCharCode(65 + idx)}
          </span>
          ${op}
        </button>
      `).join('')}
    </div>

    <div id="quiz-feedback" style="display:none; margin-bottom:1.25rem; padding:0.85rem 1rem; border-radius:8px; font-size:0.9rem; line-height:1.5;"></div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:1rem;">
      <button class="filtro-btn" onclick="cerrarQuizModal()">Cancelar</button>
      <button id="btn-siguiente-quiz" class="btn-calcular" style="display:none; padding:0.6rem 1.25rem; border-radius:6px; font-weight:600; cursor:pointer;" onclick="siguientePreguntaQuiz()">
        ${indicePregunta < total - 1 ? 'Siguiente Pregunta ➔' : 'Ver Resultados final 🏆'}
      </button>
    </div>
  `;

  overlay.style.display = 'flex';
}

function seleccionarRespuestaQuiz(idx) {
  if (respSeleccionada !== null) return; // Ya respondió
  respSeleccionada = idx;

  const q = quizActual.preguntas[indicePregunta];
  const esCorrecta = idx === q.correcta;
  if (esCorrecta) puntaje++;

  const btns = document.querySelectorAll('.quiz-opcion-btn');
  btns.forEach((btn, i) => {
    btn.style.cursor = 'default';
    if (i === q.correcta) {
      btn.style.background = 'rgba(34, 197, 94, 0.15)';
      btn.style.borderColor = '#22c55e';
      btn.style.color = '#4ade80';
    } else if (i === idx && !esCorrecta) {
      btn.style.background = 'rgba(239, 68, 68, 0.15)';
      btn.style.borderColor = '#ef4444';
      btn.style.color = '#f87171';
    }
  });

  const feedback = document.getElementById('quiz-feedback');
  if (feedback) {
    feedback.style.display = 'block';
    if (esCorrecta) {
      feedback.style.background = 'rgba(34, 197, 94, 0.1)';
      feedback.style.border = '1px solid rgba(34, 197, 94, 0.3)';
      feedback.style.color = '#4ade80';
      feedback.innerHTML = `<strong>¡Correcto! 🎉</strong> ${q.explicacion}`;
    } else {
      feedback.style.background = 'rgba(239, 68, 68, 0.1)';
      feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      feedback.style.color = '#f87171';
      feedback.innerHTML = `<strong>Incorrecto.</strong> ${q.explicacion}`;
    }
  }

  const btnSig = document.getElementById('btn-siguiente-quiz');
  if (btnSig) btnSig.style.display = 'inline-block';
}

function siguientePreguntaQuiz() {
  respSeleccionada = null;
  indicePregunta++;
  if (indicePregunta < quizActual.preguntas.length) {
    renderQuizModal();
  } else {
    mostrarResultadosQuiz();
  }
}

function mostrarResultadosQuiz() {
  const box = document.getElementById('quiz-modal-box');
  const total = quizActual.preguntas.length;
  const porcentaje = Math.round((puntaje / total) * 100);
  const aprobo = porcentaje >= 60;

  // Guardar avance de progreso en localStorage
  if (aprobo) {
    let progreso = JSON.parse(localStorage.getItem('boncloud_progreso_curso') || '{}');
    progreso[quizActual.key] = true;
    localStorage.setItem('boncloud_progreso_curso', JSON.stringify(progreso));
    if (window.actualizarProgresoUI) window.actualizarProgresoUI();
  }

  box.innerHTML = `
    <div style="text-align:center; padding:1.5rem 0;">
      <div style="font-size:3.5rem; margin-bottom:0.5rem;">${aprobo ? '🎯' : '📚'}</div>
      <h2 style="font-size:1.6rem; color:var(--text-primary); margin-bottom:0.5rem;">
        ${aprobo ? '¡Felicidades! Módulo Superado' : 'Sigue Practicando'}
      </h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
        Respondiste correctamente <strong>${puntaje} de ${total} preguntas (${porcentaje}%)</strong>.
      </p>

      <div style="background:var(--bg-panel); border:1px solid var(--border); padding:1rem; border-radius:8px; max-width:350px; margin:0 auto 1.5rem;">
        <span style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:0.4rem;">Estado de evaluación:</span>
        <strong style="color:${aprobo ? '#4ade80' : '#f87171'}; font-size:1.1rem;">
          ${aprobo ? '✅ APROBADO' : '❌ REQUIERE REPASO (Mínimo 60%)'}
        </strong>
      </div>

      <div style="display:flex; justify-content:center; gap:0.8rem;">
        <button class="filtro-btn" onclick="iniciarQuizModal('${quizActual.key}')">Reintentar Quiz 🔄</button>
        <button class="btn-calcular" style="padding:0.6rem 1.2rem; border-radius:6px; font-weight:600; cursor:pointer;" onclick="cerrarQuizModal()">
          Volver a la Ruta de Aprendizaje ➔
        </button>
      </div>
    </div>
  `;
}

function cerrarQuizModal() {
  const overlay = document.getElementById('quiz-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}
