/**
 * BonCloud — Ruta de Aprendizaje (Modo Curso)
 * Lógica principal de renderizado, progreso, mapa animado y quizzes.
 */

(function() {
  'use strict';

  // State keys & storage isolation
  const STORAGE_KEY = 'boncloud_progreso_curso';

  /**
   * Carga el progreso del curso desde localStorage.
   * Aislado en función propia para facilitar futura migración a PostgreSQL.
   */
  window.cargarProgreso = function() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { leccionesCompletadas: [], respuestasQuiz: {} };
    } catch (e) {
      console.warn('Error al cargar progreso local:', e);
      return { leccionesCompletadas: [], respuestasQuiz: {} };
    }
  };

  /**
   * Guarda el progreso del curso en localStorage.
   * Aislado en función propia para facilitar futura migración a PostgreSQL.
   */
  window.guardarProgreso = function(progreso) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
      // Intentar sincronizar con backend en segundo plano si hay sesión activa
      sincronizarBackendOpcional(progreso);
    } catch (e) {
      console.warn('Error al guardar progreso local:', e);
    }
  };

  function sincronizarBackendOpcional(progreso) {
    try {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuario = JSON.parse(usuarioRaw);
        if (usuario && usuario.id) {
          fetch(`/api/progreso/${usuario.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progreso })
          }).catch(() => { /* Silent failure if backend route offline */ });
        }
      }
    } catch (err) {
      // Ignorar errores de red en sincronización silenciosa
    }
  }

  // Estado local en ejecución
  let leccionActualId = 1;
  let quizRespuestasUsuario = {}; // { qIndex: opcionSeleccionadaIndex }

  document.addEventListener('DOMContentLoaded', () => {
    initRutaAprendizaje();
  });

  function initRutaAprendizaje() {
    renderizarProgresoHeader();
    renderizarMapaProgreso();
    renderizarListaLecciones();
    initIntersectionObserver();
    bindEvents();
    
    // Si viene parametro leccion en la URL (ej: ?leccion=2)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = parseInt(urlParams.get('leccion'), 10);
    if (idParam && idParam >= 1 && idParam <= CURSO_LECCIONES.length) {
      abrirLeccion(idParam);
    } else {
      // Abrir la lección activa más reciente o la 1
      const progreso = cargarProgreso();
      const completadas = progreso.leccionesCompletadas || [];
      let siguiente = 1;
      for (let i = 1; i <= CURSO_LECCIONES.length; i++) {
        if (!completadas.includes(i)) {
          siguiente = i;
          break;
        }
        if (i === CURSO_LECCIONES.length) siguiente = CURSO_LECCIONES.length;
      }
      abrirLeccion(siguiente);
    }
  }

  /**
   * Renderiza el encabezado general con barra de porcentaje e hitos
   */
  function renderizarProgresoHeader() {
    const progreso = cargarProgreso();
    const completadas = progreso.leccionesCompletadas || [];
    const total = CURSO_LECCIONES.length;
    const porcentaje = Math.round((completadas.length / total) * 100);

    const txtPorcentaje = document.getElementById('curso-porcentaje-texto');
    const barProgreso = document.getElementById('curso-progreso-bar');
    const txtConteo = document.getElementById('curso-conteo-texto');
    const btnCertificado = document.getElementById('btn-descargar-certificado');

    if (txtPorcentaje) txtPorcentaje.textContent = `${porcentaje}%`;
    if (barProgreso) barProgreso.style.width = `${porcentaje}%`;
    if (txtConteo) txtConteo.textContent = `${completadas.length} de ${total} lecciones completadas`;
    if (btnCertificado) {
      btnCertificado.style.display = completadas.length === total ? 'inline-flex' : 'none';
    }
  }

  /**
   * Renderiza el mapa interactivo (Shanghái -> Buque -> Puerto -> DIAN -> Bodega)
   */
  function renderizarMapaProgreso() {
    const contenedorMapa = document.getElementById('mapa-ruta-container');
    if (!contenedorMapa) return;

    const progreso = cargarProgreso();
    const completadas = progreso.leccionesCompletadas || [];
    const total = CURSO_LECCIONES.length;

    // Etapas del embarque asociadas a lecciones (1..8)
    // Nodes: 1 (Shanghái), 2 (Buque / Tránsito), 3 (Puerto Cartagena), 4 (DIAN / Aduana), 5 (Bodega)
    const nodos = [
      { id: 1, label: 'Shanghái', sub: 'Origen & Negociación', icono: '🏭', lecciones: [1, 2] },
      { id: 2, label: 'Tránsito Marítimo', sub: 'Buque en Alta Mar', icono: '🚢', lecciones: [3, 4] },
      { id: 3, label: 'Puerto Cartagena', sub: 'Arribo & Bodegaje', icono: '🏗️', lecciones: [5] },
      { id: 4, label: 'DIAN Cartagena', sub: 'Vistos Buenos & Levante', icono: '📋', lecciones: [6, 7] },
      { id: 5, label: 'Bodega Final', sub: 'Nacionalizado & Entrega', icono: '🏢', lecciones: [8] }
    ];

    // Determinar la lección máxima completada o activa
    let leccionMaxima = 1;
    if (completadas.length > 0) {
      leccionMaxima = Math.max(...completadas) + 1;
      if (leccionMaxima > total) leccionMaxima = total;
    }

    // Posición porcentual de la ruta (0% a 100%)
    const pctRuta = Math.min(100, Math.max(0, ((leccionMaxima - 1) / (total - 1)) * 100));

    let htmlNodos = '';
    nodos.forEach((n, idx) => {
      const minLeccion = Math.min(...n.lecciones);
      const maxLeccion = Math.max(...n.lecciones);
      const estaAlcanzado = completadas.some(l => n.lecciones.includes(l)) || leccionMaxima >= minLeccion;
      const estaCompletado = n.lecciones.every(l => completadas.includes(l));

      let statusClass = 'nodo-pendiente';
      if (estaCompletado) statusClass = 'nodo-completado';
      else if (estaAlcanzado) statusClass = 'nodo-activo';

      htmlNodos += `
        <div class="mapa-nodo ${statusClass}" data-nodo="${n.id}" onclick="window.irALeccionNodo(${minLeccion})">
          <div class="nodo-icono-wrapper">
            <span class="nodo-icono">${n.icono}</span>
            ${estaCompletado ? '<span class="nodo-check">✓</span>' : ''}
          </div>
          <div class="nodo-info">
            <span class="nodo-titulo">${n.label}</span>
            <span class="nodo-sub">${n.sub}</span>
          </div>
        </div>
      `;
    });

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    contenedorMapa.innerHTML = `
      <div class="mapa-ruta-track">
        <div class="mapa-ruta-linea-bg"></div>
        <div class="mapa-ruta-linea-fill" style="width: ${pctRuta}%; ${isReducedMotion ? 'transition:none;' : ''}"></div>
        <div class="mapa-contenedor-animado" style="left: ${pctRuta}%; ${isReducedMotion ? 'transition:none;' : ''}" title="Embarque actual: 500 bombas hidráulicas">
          📦 <span class="contenedor-label">500 Bombas</span>
        </div>
      </div>
      <div class="mapa-nodos-grid">
        ${htmlNodos}
      </div>
    `;
  }

  window.irALeccionNodo = function(numLeccion) {
    abrirLeccion(numLeccion);
  };

  /**
   * Renderiza las tarjetas de lecciones (1 a 8) en la lista lateral/grilla
   */
  function renderizarListaLecciones() {
    const contenedor = document.getElementById('lecciones-cards-container');
    if (!contenedor) return;

    const progreso = cargarProgreso();
    const completadas = progreso.leccionesCompletadas || [];

    let htmlCards = '';

    CURSO_LECCIONES.forEach((lec) => {
      const esCompletada = completadas.includes(lec.id);
      // Una lección está desbloqueada si es la lección 1, o si la lección anterior está completada
      const esDesbloqueada = lec.id === 1 || completadas.includes(lec.id - 1);
      const esActiva = lec.id === leccionActualId;

      let cardState = 'bloqueada';
      let iconEstado = '🔒';
      let badgeEstado = 'Bloqueada';

      if (esCompletada) {
        cardState = 'completada';
        iconEstado = '✓';
        badgeEstado = 'Completada';
      } else if (esDesbloqueada) {
        cardState = 'disponible';
        iconEstado = '📖';
        badgeEstado = 'Disponible';
      }

      htmlCards += `
        <div class="leccion-card card-state-${cardState} ${esActiva ? 'card-activa' : ''}" 
             data-id="${lec.id}" 
             onclick="${esDesbloqueada ? `window.seleccionarLeccion(${lec.id})` : ''}">
          <div class="leccion-card-header">
            <span class="leccion-numero">Lección ${lec.orden} de 8</span>
            <span class="leccion-nivel-badge nivel-${lec.nivel.toLowerCase()}">${lec.nivel}</span>
          </div>
          <h4 class="leccion-card-titulo">${lec.titulo}</h4>
          <div class="leccion-card-meta">
            <span>⏱️ ${lec.duracionMin} min</span>
            <span class="leccion-estado-badge estado-${cardState}">${iconEstado} ${badgeEstado}</span>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = htmlCards;
  }

  window.seleccionarLeccion = function(id) {
    abrirLeccion(id);
  };

  /**
   * Abre la lección especificada y renderiza su detalle y quiz
   */
  function abrirLeccion(id) {
    const leccion = CURSO_LECCIONES.find(l => l.id === id);
    if (!leccion) return;

    const progreso = cargarProgreso();
    const completadas = progreso.leccionesCompletadas || [];
    const esDesbloqueada = id === 1 || completadas.includes(id - 1);

    if (!esDesbloqueada) {
      mostrarNotificacion('Esta lección está bloqueada. Completa primero la lección anterior.', 'warning');
      return;
    }

    leccionActualId = id;
    quizRespuestasUsuario = {}; // Limpiar respuestas para la lección

    renderizarListaLecciones();
    renderizarMapaProgreso();

    const contenedorDetalle = document.getElementById('leccion-detalle-container');
    if (!contenedorDetalle) return;

    const esCompletada = completadas.includes(id);

    // Objetivos HTML
    const objetivosHTML = leccion.objetivos.map(obj => `<li>${obj}</li>`).join('');

    // Quiz HTML
    const quizHTML = renderizarQuizSeccion(leccion, esCompletada);

    contenedorDetalle.innerHTML = `
      <div class="leccion-detalle-wrapper fade-in-content">
        <div class="leccion-header-panel">
          <div class="leccion-header-meta">
            <span class="leccion-badge-paso">Paso ${leccion.orden} de 8</span>
            <span class="leccion-badge-nivel nivel-${leccion.nivel.toLowerCase()}">${leccion.nivel}</span>
            <span class="leccion-badge-tiempo">⏱️ ${leccion.duracionMin} min de lectura</span>
            ${esCompletada ? '<span class="leccion-badge-aprobado">🏆 Lección Completada</span>' : ''}
          </div>
          <h2 class="leccion-main-titulo">${leccion.titulo}</h2>
        </div>

        <!-- OBJETIVOS -->
        <div class="leccion-block block-objetivos">
          <h3>🎯 Objetivos de Aprendizaje</h3>
          <ul>${objetivosHTML}</ul>
        </div>

        <!-- CASO PRÁCTICO DESTACADO -->
        <div class="leccion-block block-caso">
          <div class="caso-header">
            <span class="caso-icono">🚢</span>
            <div>
              <h4>¿Qué pasa con tu embarque en esta etapa?</h4>
              <p class="caso-sub">Caso: 500 bombas hidráulicas Shanghái ➔ Puerto de Cartagena</p>
            </div>
          </div>
          <div class="caso-body">
            <p>${leccion.etapaCaso}</p>
          </div>
        </div>

        <!-- CONTENIDO TÉCNICO -->
        <div class="leccion-block block-contenido">
          <h3>📖 Contenido Técnico & Normativa Aduanera</h3>
          <div class="contenido-html">${leccion.contenido}</div>
        </div>

        <!-- BOTÓN PRÁCTICA REAL -->
        ${leccion.practica ? `
          <div class="leccion-block block-practica">
            <div class="practica-inner">
              <div>
                <h4>🧮 Practica con la herramienta interactiva</h4>
                <p>${leccion.practica.texto}</p>
              </div>
              <button class="btn btn-primary btn-practica-modulo" onclick="window.abrirModuloPractica('${leccion.practica.moduloUrl}', ${JSON.stringify(leccion.practica.parametros).replace(/"/g, '&quot;')})">
                Ir al Módulo ➔
              </button>
            </div>
          </div>
        ` : ''}

        <!-- QUIZ DE EVALUACIÓN -->
        <div class="leccion-block block-quiz" id="seccion-quiz-leccion">
          <h3>📝 Evaluación de la Lección (${leccion.quiz.length} Preguntas)</h3>
          <p class="quiz-instrucción">Responde las preguntas y aprueba con al menos 70% de aciertos para desbloquear el siguiente paso.</p>
          ${quizHTML}
        </div>
      </div>
    `;

    // Activar eventos de glosario si existen en el contenido recién inyectado
    initGlosarioLinks();

    // Scroll suave a la vista de lección en pantallas pequeñas
    if (window.innerWidth < 900) {
      contenedorDetalle.scrollIntoView({ behavior: 'smooth' });
    }
  }

  window.abrirModuloPractica = function(url, params) {
    if (!url) return;
    let target = url;
    if (params && Object.keys(params).length > 0) {
      const q = new URLSearchParams(params).toString();
      target += (target.includes('?') ? '&' : '?') + q;
    }
    window.location.href = target;
  };

  /**
   * Renderiza el bloque HTML del Quiz de una lección
   */
  function renderizarQuizSeccion(leccion, esCompletada) {
    let htmlPreguntas = '';

    leccion.quiz.forEach((q, qIndex) => {
      let opcionesHTML = '';
      q.opciones.forEach((op, opIndex) => {
        opcionesHTML += `
          <button class="quiz-opcion-btn" 
                  data-q="${qIndex}" 
                  data-op="${opIndex}" 
                  onclick="window.responderOpcionQuiz(${leccion.id}, ${qIndex}, ${opIndex})">
            <span class="opcion-letra">${String.fromCharCode(65 + opIndex)}</span>
            <span class="opcion-texto">${op}</span>
          </button>
        `;
      });

      htmlPreguntas += `
        <div class="quiz-pregunta-card" id="pregunta-card-${qIndex}">
          <h4 class="pregunta-titulo">${qIndex + 1}. ${q.pregunta}</h4>
          <div class="quiz-opciones-list">
            ${opcionesHTML}
          </div>
          <div class="quiz-explicacion-box" id="explicacion-card-${qIndex}" style="display:none;">
          </div>
        </div>
      `;
    });

    return `
      <div class="quiz-container">
        ${htmlPreguntas}
        <div class="quiz-resultado-panel" id="quiz-resultado-panel" style="display:none;">
        </div>
      </div>
    `;
  }

  /**
   * Maneja la selección de una opción en el quiz con retroalimentación inmediata
   */
  window.responderOpcionQuiz = function(leccionId, qIndex, opcionIndex) {
    const leccion = CURSO_LECCIONES.find(l => l.id === leccionId);
    if (!leccion) return;

    // Si ya respondió esa pregunta, ignorar clics adicionales
    if (quizRespuestasUsuario[qIndex] !== undefined) return;

    quizRespuestasUsuario[qIndex] = opcionIndex;

    const preguntaObj = leccion.quiz[qIndex];
    const esCorrecta = opcionIndex === preguntaObj.correcta;

    const cardPregunta = document.getElementById(`pregunta-card-${qIndex}`);
    if (!cardPregunta) return;

    // Marcar botones de opciones
    const btns = cardPregunta.querySelectorAll('.quiz-opcion-btn');
    btns.forEach((btn) => {
      const btnOpIndex = parseInt(btn.getAttribute('data-op'), 10);
      btn.classList.add('disabled');

      if (btnOpIndex === preguntaObj.correcta) {
        btn.classList.add('opcion-correcta');
      } else if (btnOpIndex === opcionIndex && !esCorrecta) {
        btn.classList.add('opcion-incorrecta');
      }
    });

    // Mostrar caja de explicación inmediata
    const expBox = document.getElementById(`explicacion-card-${qIndex}`);
    if (expBox) {
      expBox.style.display = 'block';
      expBox.className = `quiz-explicacion-box ${esCorrecta ? 'exp-correcta' : 'exp-incorrecta'}`;
      expBox.innerHTML = `
        <div class="exp-header">
          ${esCorrecta ? '✅ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}
        </div>
        <p class="exp-texto">${preguntaObj.explicacion}</p>
      `;
    }

    // Verificar si ya respondió todas las preguntas del quiz
    if (Object.keys(quizRespuestasUsuario).length === leccion.quiz.length) {
      evaluarFinQuiz(leccion);
    }
  };

  /**
   * Evalúa el resultado final del quiz de la lección
   */
  function evaluarFinQuiz(leccion) {
    let aciertos = 0;
    const totalQ = leccion.quiz.length;

    leccion.quiz.forEach((q, qIndex) => {
      if (quizRespuestasUsuario[qIndex] === q.correcta) {
        aciertos++;
      }
    });

    const porcentajeScore = Math.round((aciertos / totalQ) * 100);
    const esAprobado = porcentajeScore >= 70;

    const panelResultado = document.getElementById('quiz-resultado-panel');
    if (!panelResultado) return;

    panelResultado.style.display = 'block';

    if (esAprobado) {
      panelResultado.className = 'quiz-resultado-panel resultado-aprobado';
      panelResultado.innerHTML = `
        <div class="resultado-header">
          <span class="resultado-icon">🎉</span>
          <div>
            <h4>¡Felicitaciones! Has aprobado el quiz de esta lección</h4>
            <p>Puntaje obtenido: <strong>${aciertos}/${totalQ} (${porcentajeScore}%)</strong>. Criterio de aprobación: 70%.</p>
          </div>
        </div>
        <div class="resultado-acciones">
          ${leccion.id < CURSO_LECCIONES.length ? `
            <button class="btn btn-primary" onclick="window.continuarSiguienteLeccion(${leccion.id})">
              Siguiente Lección (Lección ${leccion.id + 1}) ➔
            </button>
          ` : `
            <button class="btn btn-success" onclick="window.generarDiplomaPDF()">
              🏆 Descargar Certificado de Aprobación (PDF)
            </button>
          `}
        </div>
      `;

      // Guardar progreso actualizado
      const progreso = cargarProgreso();
      if (!progreso.leccionesCompletadas.includes(leccion.id)) {
        progreso.leccionesCompletadas.push(leccion.id);
        guardarProgreso(progreso);
      }

      renderizarProgresoHeader();
      renderizarMapaProgreso();
      renderizarListaLecciones();

      mostrarNotificacion(`¡Lección ${leccion.orden} completada con éxito!`, 'success');
    } else {
      panelResultado.className = 'quiz-resultado-panel resultado-reprobado';
      panelResultado.innerHTML = `
        <div class="resultado-header">
          <span class="resultado-icon">⚠️</span>
          <div>
            <h4>Aún no alcanzas el 70% requerido</h4>
            <p>Puntaje obtenido: <strong>${aciertos}/${totalQ} (${porcentajeScore}%)</strong>. Repasa los contenidos y vuelve a intentarlo.</p>
          </div>
        </div>
        <div class="resultado-acciones">
          <button class="btn btn-secondary" onclick="window.reintentarQuizLeccion(${leccion.id})">
            🔄 Reintentar Quiz
          </button>
        </div>
      `;
    }
  }

  window.continuarSiguienteLeccion = function(idActual) {
    if (idActual < CURSO_LECCIONES.length) {
      abrirLeccion(idActual + 1);
    }
  };

  window.reintentarQuizLeccion = function(idLeccion) {
    abrirLeccion(idLeccion);
  };

  /**
   * Manejador para los términos con data-glosario
   */
  function initGlosarioLinks() {
    const terms = document.querySelectorAll('.term-glosario[data-glosario]');
    terms.forEach(termEl => {
      termEl.addEventListener('click', (e) => {
        e.preventDefault();
        const term = termEl.getAttribute('data-glosario');
        if (typeof window.abrirModalGlosario === 'function') {
          window.abrirModalGlosario(term);
        } else {
          mostrarNotificacion(`Término aduanero: ${term}. Consulta el Glosario completo para más detalles.`, 'info');
        }
      });
    });
  }

  /**
   * IntersectionObserver para animaciones de entrada en scroll
   */
  function initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.leccion-card, .leccion-block').forEach(el => {
        observer.observe(el);
      });
    }
  }

  /**
   * Reiniciar progreso del curso con confirmación
   */
  window.reiniciarProgresoCurso = function() {
    const confirmado = confirm('¿Estás seguro de que deseas reiniciar tu progreso en la Ruta de Aprendizaje?\nSe borrarán las lecciones completadas en este dispositivo.');
    if (confirmado) {
      guardarProgreso({ leccionesCompletadas: [], respuestasQuiz: {} });
      initRutaAprendizaje();
      mostrarNotificacion('El progreso del curso ha sido reiniciado.', 'info');
    }
  };

  function bindEvents() {
    const btnReset = document.getElementById('btn-reiniciar-progreso');
    if (btnReset) {
      btnReset.addEventListener('click', window.reiniciarProgresoCurso);
    }
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `boncloud-toast toast-${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

})();
