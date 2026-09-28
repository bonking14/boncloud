// BonCloud — sesión y elementos comunes del sidebar
// Encapsulado en una IIFE para no crear variables globales (token, usuario)
// que choquen con otros scripts de la página.
(function () {
    'use strict';

    function leerUsuario() {
        try {
            return JSON.parse(localStorage.getItem('usuario'));
        } catch (e) {
            return null;
        }
    }

    const token = localStorage.getItem('token');
    const usuario = leerUsuario();

    if (!token || !usuario) {
        window.location.href = '../index.html';
        return;
    }

    const nombre = usuario.nombre || 'Usuario';
    const saludo = document.getElementById('saludo');
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (saludo) saludo.textContent = nombre;
    if (nombreUsuario) nombreUsuario.textContent = nombre;

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '../index.html';
        });
    }

    // ========== DROPDOWN TOGGLE ==========
    function initDropdown(toggleId, submenuId) {
        const toggle = document.getElementById(toggleId);
        const submenu = document.getElementById(submenuId);
        if (!toggle || !submenu) return;

        toggle.classList.add('open');
        submenu.classList.add('open');

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            submenu.classList.toggle('open');
        });
    }

    initDropdown('importacion-toggle', 'importacion-submenu');
    initDropdown('exportacion-toggle', 'exportacion-submenu');
})();
