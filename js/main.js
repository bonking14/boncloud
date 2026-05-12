const API = 'http://localhost:4000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Elementos del nuevo diseño
  const loginBtn = document.getElementById('loginBtn');
  const btnText = loginBtn.querySelector('.btn-text');
  const btnLoader = loginBtn.querySelector('.btn-loader');
  const form = document.getElementById('loginForm');

  // Mostrar loader y deshabilitar botón
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  loginBtn.disabled = true;

  // Eliminar mensaje de error anterior si existe
  const oldError = document.querySelector('.dynamic-error');
  if (oldError) oldError.remove();

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      // Error visual con animación shake
      form.classList.add('error-shake');
      setTimeout(() => form.classList.remove('error-shake'), 500);
      
      mostrarError(data.error || 'Error al ingresar.');
      
      // Restaurar botón
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      loginBtn.disabled = false;
      return;
    }

    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // Redirigir al dashboard
    window.location.href = 'pages/dashboard.html';

  } catch (err) {
    // Error de conexión con animación
    form.classList.add('error-shake');
    setTimeout(() => form.classList.remove('error-shake'), 500);
    
    mostrarError('No se pudo conectar con el servidor.');
    
    // Restaurar botón
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    loginBtn.disabled = false;
  }
});

function mostrarError(mensaje) {
  let error = document.querySelector('.dynamic-error');
  if (!error) {
    error = document.createElement('p');
    error.className = 'dynamic-error';
    error.style.cssText = 'color:#ff5c5c;font-size:0.8rem;text-align:center;margin-top:1rem;padding:8px;background:rgba(255,92,92,0.1);border-radius:12px;';
    document.getElementById('loginForm').appendChild(error);
  }
  error.textContent = mensaje;
}

// ========== ANIMACIÓN EXTRA: Ripple en el botón ==========
document.querySelectorAll('.btn-login-modern').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.disabled) return;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = `${e.clientX - this.offsetLeft}px`;
    ripple.style.top = `${e.clientY - this.offsetTop}px`;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}); 