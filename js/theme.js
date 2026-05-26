// ============================================================
//  BonCloud — Theme Toggle (dark default, light optional)
// ============================================================

(function () {
  const STORAGE_KEY = 'boncloud-theme';

  // Aplicar tema guardado antes de que cargue el DOM (evita flash)
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Crear botón en el sidebar-footer
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return;

    const btn = document.createElement('button');
    btn.id = 'btnTheme';
    btn.className = 'btn-theme';
    btn.setAttribute('aria-label', 'Cambiar tema');
    btn.innerHTML = getIcon();
    footer.insertBefore(btn, footer.firstChild);

    btn.addEventListener('click', function () {
      const isLight = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
      btn.innerHTML = getIcon();
    });

    function getIcon() {
      const isLight = document.documentElement.classList.contains('light-mode');
      return isLight
        ? '<span class="theme-icon"></span> Modo oscuro'
        : '<span class="theme-icon"></span> Modo claro';
    }
  });
})();