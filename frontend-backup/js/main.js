const API = 'http://localhost:4000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const btn = document.querySelector('.btn-login');

  btn.textContent = 'Ingresando...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarError(data.error || 'Error al ingresar.');
      btn.textContent = 'Ingresar';
      btn.disabled = false;
      return;
    }

    // Guardar token
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // Redirigir al dashboard
    window.location.href = 'pages/dashboard.html';

  } catch (err) {
    mostrarError('No se pudo conectar con el servidor.');
    btn.textContent = 'Ingresar';
    btn.disabled = false;
  }
});

function mostrarError(mensaje) {
  let error = document.getElementById('error-msg');
  if (!error) {
    error = document.createElement('p');
    error.id = 'error-msg';
    error.style.cssText = 'color:#ef4444;font-size:13px;text-align:center;margin-top:12px;';
    document.getElementById('loginForm').appendChild(error);
  }
  error.textContent = mensaje;
}