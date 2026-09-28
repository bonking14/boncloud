/**
 * BonCloud — Ruta de Aprendizaje (Modo Curso)
 * Renderizado de lecciones, progreso local, mapa del embarque y quizzes.
 */

(function () {
  'use strict';

  // v2: el orden de las lecciones cambió (vistos buenos pasó a la lección 4),
  // así que el progreso anterior no es compatible.
  const STORAGE_KEY = 'boncloud_progreso_curso_v2';
  const UMBRAL_APROBACION = 0.7;
  const TOTAL = CURSO_LECCIONES.length;

  // Etapas del embarque y las lecciones que cubre cada una
  const NODOS = [
    { label: 'Shanghái', sub: 'Negociación y compra', icono: '🏭', lecciones: [1, 2] },
    { label: 'Antes de embarcar', sub: 'Clasificación y requisitos', icono: '📑', lecciones: [3, 4] },
    { label: 'Tránsito marítimo', sub: 'Valor en aduana', icono: '🚢', lecciones: [5] },
    { label: 'DIAN', sub: 'Tributos y declaración', icono: '📋', lecciones: [6, 7] },
    { label: 'Cartagena → bodega', sub: 'Levante y retiro', icono: '🏢', lecciones: [8] }
  ];

  // ───────── Progreso (aislado para migrarlo luego al backend) ─────────
  function progresoVacio() {
    return { leccionesCompletadas: [] };
  }

  window.cargarProgreso = function () {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (!data || !Array.isArray(data.leccionesCompletadas)) return progresoVacio();
      data.leccionesCompletadas = data.leccionesCompletadas
        .filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL);
      return data;
    } catch (e) {
      return progresoVacio();
    }
  };

  window.guardarProgreso = function (progreso) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
    } catch (e) {
      mostrarNotificacion('No se pudo guardar tu progreso en este navegador.', 'warning');
    }
  };

  function completadas() {
    return cargarProgreso().leccionesCompletadas;
  }

  function estaDesbloqueada(id) {
    return id === 1 || completadas().includes(id - 1);
  }

  function siguientePendiente() {
    const hechas = completadas();
    for (let i = 1; i <= TOTAL; i++) {
      if (!hechas.includes(i)) return i;
    }
    return TOTAL;
  }

  // ───────── Estado de la vista ─────────
  let leccionActualId = 1;
  let respuestas = {};      // { qIndex: índice original elegido }
  let mapaConstruido = false;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    construirMapa();
    renderizarProgresoHeader();
    renderizarListaLecciones();
    bindEvents();

    const idParam = parseInt(new URLSearchParams(window.location.search).get('leccion'), 10);
    const inicial = (idParam >= 1 && idParam <= TOTAL && estaDesbloqueada(idParam)) ? idParam : siguientePendiente();
    abrirLeccion(inicial, { desplazar: false });
  }

  // ───────── Encabezado de progreso ─────────
  function renderizarProgresoHeader() {
    const hechas = completadas().length;
    const porcentaje = Math.round((hechas / TOTAL) * 100);

    const txtPorcentaje = document.getElementById('curso-porcentaje-texto');
    const barProgreso = document.getElementById('curso-progreso-bar');
    const txtConteo = document.getElementById('curso-conteo-texto');
    const track = document.querySelector('.curso-progress-track');
    const btnConstancia = document.getElementById('btn-descargar-certificado');
    const btnReset = document.getElementById('btn-reiniciar-progreso');

    if (txtPorcentaje) txtPorcentaje.textContent = `${porcentaje}%`;
    if (barProgreso) barProgreso.style.width = `${porcentaje}%`;
    if (track) {
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', String(TOTAL));
      track.setAttribute('aria-valuenow', String(hechas));
      track.setAttribute('aria-label', 'Lecciones completadas');
    }
    if (txtConteo) txtConteo.textContent = `${hechas} de ${TOTAL} lecciones completadas`;
    if (btnConstancia) btnConstancia.hidden = hechas !== TOTAL;
    if (btnReset) btnReset.hidden = hechas === 0;
  }

  // ───────── Mapa del embarque ─────────
  // Se construye una sola vez; luego solo cambian posiciones y clases,
  // así la transición CSS del contenedor sí se ve.
  function construirMapa() {
    const cont = document.getElementById('mapa-ruta-container');
    if (!cont || mapaConstruido) return;

    const nodosHTML = NODOS.map((n, i) => `
      <button type="button" class="mapa-nodo" data-nodo="${i}">
        <span class="nodo-icono-wrapper" aria-hidden="true">
          <span class="nodo-icono">${n.icono}</span>
          <span class="nodo-check">✓</span>
        </span>
        <span class="nodo-info">
          <span class="nodo-titulo">${n.label}</span>
          <span class="nodo-sub">${n.sub}</span>
        </span>
      </button>
    `).join('');

    cont.innerHTML = `
      <div class="mapa-ruta-track" aria-hidden="true">
        <div class="mapa-ruta-linea-bg"></div>
        <div class="mapa-ruta-linea-fill"></div>
        <div class="mapa-contenedor-animado" title="Embarque: 500 bombas de engranajes">
          <span class="contenedor-icono">📦</span><span class="contenedor-label">500 bombas</span>
        </div>
      </div>
      <div class="mapa-nodos-grid">${nodosHTML}</div>
    `;

    cont.querySelectorAll('.mapa-nodo').forEach(btn => {
      btn.addEventListener('click', () => {
        const nodo = NODOS[parseInt(btn.dataset.nodo, 10)];
        const primera = Math.min(...nodo.lecciones);
        abrirLeccion(primera, { desplazar: true });
      });
    });

    mapaConstruido = true;
    actualizarMapa({ desdeOrigen: true });
  }

  function nodoDeLeccion(id) {
    const i = NODOS.findIndex(n => n.lecciones.includes(id));
    return i < 0 ? 0 : i;
  }

  function actualizarMapa(opciones = {}) {
    const cont = document.getElementById('mapa-ruta-container');
    if (!cont) return;
    const hechas = completadas();
    const cursoTerminado = hechas.length === TOTAL;
    const nodoActual = cursoTerminado ? NODOS.length - 1 : nodoDeLeccion(siguientePendiente());
    const pct = (nodoActual / (NODOS.length - 1)) * 100;

    const fill = cont.querySelector('.mapa-ruta-linea-fill');
    const caja = cont.querySelector('.mapa-contenedor-animado');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const aplicar = () => {
      if (fill) fill.style.width = `${pct}%`;
      if (caja) caja.style.left = `${pct}%`;
    };

    if (opciones.desdeOrigen && !reduced) {
      // Único momento animado al cargar: el contenedor viaja desde Shanghái hasta la etapa actual.
      if (fill) fill.style.width = '0%';
      if (caja) caja.style.left = '0%';
      requestAnimationFrame(() => requestAnimationFrame(aplicar));
    } else {
      aplicar();
    }

    cont.querySelectorAll('.mapa-nodo').forEach((btn, i) => {
      const nodo = NODOS[i];
      const completado = nodo.lecciones.every(l => hechas.includes(l));
      const alcanzado = estaDesbloqueada(Math.min(...nodo.lecciones));
      btn.classList.toggle('nodo-completado', completado);
      btn.classList.toggle('nodo-activo', !completado && alcanzado);
      btn.classList.toggle('nodo-pendiente', !alcanzado);
      btn.classList.toggle('nodo-seleccionado', nodo.lecciones.includes(leccionActualId));
      btn.setAttribute('aria-disabled', alcanzado ? 'false' : 'true');
      const estado = completado ? 'completada' : (alcanzado ? 'disponible' : 'bloqueada');
      btn.setAttribute('aria-label', `${nodo.label}: ${nodo.sub}. Etapa ${estado}.`);
    });
  }

  // ───────── Tarjetas de lecciones ─────────
  function renderizarListaLecciones() {
    const contenedor = document.getElementById('lecciones-cards-container');
    if (!contenedor) return;
    const hechas = completadas();

    contenedor.innerHTML = CURSO_LECCIONES.map(lec => {
      const completada = hechas.includes(lec.id);
      const desbloqueada = estaDesbloqueada(lec.id);
      const activa = lec.id === leccionActualId;

      let estado = 'bloqueada', icono = '🔒', texto = 'Bloqueada';
      if (completada) { estado = 'completada'; icono = '✓'; texto = 'Completada'; }
      else if (desbloqueada) { estado = 'disponible'; icono = '📖'; texto = 'Disponible'; }

      return `
        <button type="button"
                class="leccion-card card-state-${estado} ${activa ? 'card-activa' : ''}"
                data-id="${lec.id}"
                aria-disabled="${desbloqueada ? 'false' : 'true'}"
                ${activa ? 'aria-current="step"' : ''}>
          <span class="leccion-card-header">
            <span class="leccion-numero">Lección ${lec.orden} de ${TOTAL}</span>
            <span class="leccion-nivel-badge nivel-${lec.nivel.toLowerCase()}">${lec.nivel}</span>
          </span>
          <span class="leccion-card-titulo">${lec.titulo}</span>
          <span class="leccion-card-meta">
            <span>${lec.duracionMin} min</span>
            <span class="leccion-estado-badge estado-${estado}"><span aria-hidden="true">${icono}</span> ${texto}</span>
          </span>
        </button>
      `;
    }).join('');

    contenedor.querySelectorAll('.leccion-card').forEach(card => {
      card.addEventListener('click', () => abrirLeccion(parseInt(card.dataset.id, 10), { desplazar: true }));
    });
  }

  // ───────── Detalle de lección ─────────
  function abrirLeccion(id, opciones = {}) {
    const leccion = CURSO_LECCIONES.find(l => l.id === id);
    if (!leccion) return;

    if (!estaDesbloqueada(id)) {
      mostrarNotificacion('Esta lección se desbloquea al aprobar la anterior.', 'warning');
      return;
    }

    leccionActualId = id;
    respuestas = {};

    renderizarListaLecciones();
    actualizarMapa();

    const contenedor = document.getElementById('leccion-detalle-container');
    if (!contenedor) return;

    const completada = completadas().includes(id);
    const objetivosHTML = leccion.objetivos.map(o => `<li>${o}</li>`).join('');
    const minimo = Math.ceil(leccion.quiz.length * UMBRAL_APROBACION);

    contenedor.innerHTML = `
      <article class="leccion-detalle-wrapper fade-in-content" aria-labelledby="titulo-leccion">
        <header class="leccion-header-panel">
          <div class="leccion-header-meta">
            <span class="leccion-badge-paso">Paso ${leccion.orden} de ${TOTAL}</span>
            <span class="leccion-badge-nivel nivel-${leccion.nivel.toLowerCase()}">${leccion.nivel}</span>
            <span class="leccion-badge-tiempo">${leccion.duracionMin} min de lectura</span>
            ${completada ? '<span class="leccion-badge-aprobado">Lección aprobada</span>' : ''}
          </div>
          <h2 class="leccion-main-titulo" id="titulo-leccion" tabindex="-1">${leccion.titulo}</h2>
        </header>

        <section class="leccion-block block-objetivos">
          <h3>Qué vas a aprender</h3>
          <ul>${objetivosHTML}</ul>
        </section>

        <section class="leccion-block block-caso">
          <div class="caso-header">
            <span class="caso-icono" aria-hidden="true">🚢</span>
            <div>
              <h4>Qué pasa con tu embarque en esta etapa</h4>
              <p class="caso-sub">Caso: 500 bombas de engranajes, de Shanghái al Puerto de Cartagena</p>
            </div>
          </div>
          <div class="caso-body"><p>${leccion.etapaCaso}</p></div>
        </section>

        <section class="leccion-block block-contenido">
          <h3>Contenido y normativa</h3>
          <div class="contenido-html">${leccion.contenido}</div>
        </section>

        ${leccion.practica ? `
          <section class="leccion-block block-practica">
            <div class="practica-inner">
              <div>
                <h4>Practica con la herramienta</h4>
                <p>${leccion.practica.texto}</p>
              </div>
              <button type="button" class="btn btn-primary btn-practica-modulo" id="btn-practica">Abrir el módulo</button>
            </div>
          </section>
        ` : ''}

        <section class="leccion-block block-quiz" id="seccion-quiz-leccion">
          <h3>Evaluación de la lección</h3>
          <p class="quiz-instruccion">${leccion.quiz.length} preguntas. Necesitas ${minimo} respuestas correctas para aprobar y desbloquear el siguiente paso.</p>
          ${renderizarQuiz(leccion)}
        </section>
      </article>
    `;

    const btnPractica = document.getElementById('btn-practica');
    if (btnPractica) {
      btnPractica.addEventListener('click', () => abrirModuloPractica(leccion.practica.moduloUrl, leccion.practica.parametros));
    }
    contenedor.querySelectorAll('.quiz-opcion-btn').forEach(btn => {
      btn.addEventListener('click', () => responder(leccion.id, parseInt(btn.dataset.q, 10), parseInt(btn.dataset.op, 10)));
    });

    initGlosarioLinks(contenedor);

    if (opciones.desplazar) {
      contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const titulo = document.getElementById('titulo-leccion');
      if (titulo) titulo.focus({ preventScroll: true });
    }
  }

  function abrirModuloPractica(url, params) {
    if (!url) return;
    const q = params && Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    window.location.href = url + q;
  }

  // ───────── Quiz ─────────
  function barajar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderizarQuiz(leccion) {
    const preguntas = leccion.quiz.map((q, qIndex) => {
      const orden = barajar(q.opciones.map((_, i) => i));
      const opciones = orden.map((opIndex, pos) => `
        <button type="button" class="quiz-opcion-btn" data-q="${qIndex}" data-op="${opIndex}">
          <span class="opcion-letra" aria-hidden="true">${String.fromCharCode(65 + pos)}</span>
          <span class="opcion-texto">${q.opciones[opIndex]}</span>
        </button>
      `).join('');

      return `
        <fieldset class="quiz-pregunta-card" id="pregunta-card-${qIndex}">
          <legend class="pregunta-titulo">${qIndex + 1}. ${q.pregunta}</legend>
          <div class="quiz-opciones-list">${opciones}</div>
          <div class="quiz-explicacion-box" id="explicacion-card-${qIndex}" aria-live="polite"></div>
        </fieldset>
      `;
    }).join('');

    return `
      <div class="quiz-container">
        ${preguntas}
        <div class="quiz-resultado-panel" id="quiz-resultado-panel" role="status" aria-live="polite"></div>
      </div>
    `;
  }

  function responder(leccionId, qIndex, opIndex) {
    const leccion = CURSO_LECCIONES.find(l => l.id === leccionId);
    if (!leccion || respuestas[qIndex] !== undefined) return;

    respuestas[qIndex] = opIndex;
    const pregunta = leccion.quiz[qIndex];
    const acierto = opIndex === pregunta.correcta;

    const card = document.getElementById(`pregunta-card-${qIndex}`);
    if (!card) return;

    card.querySelectorAll('.quiz-opcion-btn').forEach(btn => {
      const op = parseInt(btn.dataset.op, 10);
      btn.disabled = true;
      btn.classList.add('disabled');
      if (op === pregunta.correcta) btn.classList.add('opcion-correcta');
      else if (op === opIndex) btn.classList.add('opcion-incorrecta');
    });

    const exp = document.getElementById(`explicacion-card-${qIndex}`);
    if (exp) {
      exp.className = `quiz-explicacion-box visible ${acierto ? 'exp-correcta' : 'exp-incorrecta'}`;
      exp.innerHTML = `
        <div class="exp-header">${acierto ? 'Correcto' : 'Incorrecto'}</div>
        <p class="exp-texto">${pregunta.explicacion}</p>
      `;
    }

    if (Object.keys(respuestas).length === leccion.quiz.length) evaluarQuiz(leccion);
  }

  function evaluarQuiz(leccion) {
    const total = leccion.quiz.length;
    const aciertos = leccion.quiz.filter((q, i) => respuestas[i] === q.correcta).length;
    const minimo = Math.ceil(total * UMBRAL_APROBACION);
    const aprobado = aciertos >= minimo;
    const panel = document.getElementById('quiz-resultado-panel');
    if (!panel) return;

    if (aprobado) {
      const progreso = cargarProgreso();
      if (!progreso.leccionesCompletadas.includes(leccion.id)) {
        progreso.leccionesCompletadas.push(leccion.id);
        guardarProgreso(progreso);
      }
      const esUltima = leccion.id === TOTAL;
      panel.className = 'quiz-resultado-panel visible resultado-aprobado';
      panel.innerHTML = `
        <div class="resultado-header">
          <div>
            <h4>Aprobaste esta lección</h4>
            <p>Respondiste bien ${aciertos} de ${total} (necesitabas ${minimo}).</p>
          </div>
        </div>
        <div class="resultado-acciones">
          <button type="button" class="btn btn-primary" id="btn-resultado-accion">
            ${esUltima ? 'Descargar constancia (PDF)' : `Ir a la lección ${leccion.id + 1}`}
          </button>
        </div>
      `;
      document.getElementById('btn-resultado-accion').addEventListener('click', () => {
        if (esUltima) window.generarConstanciaPDF();
        else abrirLeccion(leccion.id + 1, { desplazar: true });
      });

      renderizarProgresoHeader();
      renderizarListaLecciones();
      actualizarMapa();
      mostrarNotificacion(`Lección ${leccion.orden} aprobada`, 'success');
    } else {
      panel.className = 'quiz-resultado-panel visible resultado-reprobado';
      panel.innerHTML = `
        <div class="resultado-header">
          <div>
            <h4>Todavía no apruebas</h4>
            <p>Respondiste bien ${aciertos} de ${total} y necesitas ${minimo}. Repasa el contenido y vuelve a intentarlo: las opciones cambian de orden.</p>
          </div>
        </div>
        <div class="resultado-acciones">
          <button type="button" class="btn btn-secondary" id="btn-reintentar">Reintentar evaluación</button>
        </div>
      `;
      document.getElementById('btn-reintentar').addEventListener('click', () => {
        abrirLeccion(leccion.id, { desplazar: false });
        const quiz = document.getElementById('seccion-quiz-leccion');
        if (quiz) quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ───────── Glosario ─────────
  function initGlosarioLinks(raiz) {
    raiz.querySelectorAll('.term-glosario[data-glosario]').forEach(el => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      const abrir = (e) => {
        e.preventDefault();
        const termino = el.getAttribute('data-glosario');
        const abierto = typeof window.abrirModalGlosario === 'function' && window.abrirModalGlosario(termino);
        if (!abierto) mostrarNotificacion(`"${termino}" todavía no está en el glosario.`, 'info');
      };
      el.addEventListener('click', abrir);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') abrir(e); });
    });
  }

  // ───────── Reinicio ─────────
  function reiniciarProgreso() {
    if (!confirm('¿Reiniciar tu progreso en la Ruta de Aprendizaje? Se borrarán las lecciones aprobadas en este navegador.')) return;
    guardarProgreso(progresoVacio());
    renderizarProgresoHeader();
    renderizarListaLecciones();
    abrirLeccion(1, { desplazar: false });
    actualizarMapa({ desdeOrigen: true });
    mostrarNotificacion('Progreso reiniciado.', 'info');
  }

  function bindEvents() {
    const btnReset = document.getElementById('btn-reiniciar-progreso');
    if (btnReset) btnReset.addEventListener('click', reiniciarProgreso);
  }

  // ───────── Notificaciones ─────────
  function mostrarNotificacion(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `boncloud-toast toast-${tipo}`;
    toast.setAttribute('role', 'status');
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
})();
