// Verificar sesión
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = '../index.html';
}

// Mostrar nombre
document.getElementById('saludo') && (document.getElementById('saludo').textContent = usuario.nombre);
document.getElementById('nombre-usuario') && (document.getElementById('nombre-usuario').textContent = usuario.nombre);

// Cerrar sesión
document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../index.html';
});