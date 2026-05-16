// Verificar sesión
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!token || !usuario) {
    window.location.href = '../index.html';
}

document.getElementById('saludo') && (document.getElementById('saludo').textContent = usuario.nombre);
document.getElementById('nombre-usuario') && (document.getElementById('nombre-usuario').textContent = usuario.nombre);

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
});

// ========== DROPDOWN TOGGLE ==========
function initDropdown(toggleId, submenuId) {
    const toggle = document.getElementById(toggleId);
    const submenu = document.getElementById(submenuId);
    if (!toggle || !submenu) return;

    // Abrir por defecto si está en la página activa
    toggle.classList.add('open');
    submenu.classList.add('open');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        submenu.classList.toggle('open');
    });
}

initDropdown('importacion-toggle', 'importacion-submenu');
initDropdown('exportacion-toggle', 'exportacion-submenu');