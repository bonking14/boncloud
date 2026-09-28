// ============================================================
//  BonCloud — Theme Toggle (dark default, light optional)
// ============================================================

(function () {
  const STORAGE_KEY = 'boncloud-theme';

  // Detect if running inside an iframe and adjust layout dynamically
  if (window.self !== window.top) {
    document.documentElement.classList.add('in-iframe');
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('in-iframe');
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.style.display = 'none';
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
        mainContent.style.padding = '20px';
      }

      // Automatically construct iOS Segmented Control from hidden submenu if it exists
      const subMenu = document.querySelector('.nav-submenu');
      if (subMenu && mainContent) {
        const subItems = subMenu.querySelectorAll('.nav-subitem');
        if (subItems.length > 0) {
          // Inject Segmented Control Styles dynamically
          const style = document.createElement('style');
          style.textContent = `
            .ios-segmented-control {
              display: inline-flex;
              background: rgba(0, 14, 24, 0.6);
              border: 1px solid rgba(0, 195, 255, 0.25);
              border-radius: 14px;
              padding: 4px;
              gap: 4px;
              margin-top: 16px;
              backdrop-filter: blur(10px);
              box-shadow: inset 0 0 10px rgba(0, 195, 255, 0.05);
            }
            .light-mode .ios-segmented-control {
              background: rgba(255, 255, 255, 0.6);
              border-color: rgba(30, 100, 200, 0.2);
              box-shadow: none;
            }
            .ios-segment-btn {
              background: transparent;
              border: 1px solid transparent;
              color: #90cfe8;
              padding: 8px 20px;
              font-size: 0.85rem;
              font-weight: 700;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .light-mode .ios-segment-btn {
              color: #2a6a9a;
            }
            .ios-segment-btn:hover {
              color: #ffffff;
            }
            .light-mode .ios-segment-btn:hover {
              color: #0d2a4a;
            }
            .ios-segment-btn.active {
              background: rgba(0, 195, 255, 0.25);
              color: #ffffff;
              border: 1px solid rgba(0, 195, 255, 0.4);
              box-shadow: 0 4px 12px rgba(0, 195, 255, 0.15);
            }
            .light-mode .ios-segment-btn.active {
              background: #ffffff;
              color: #0d2a4a;
              border-color: rgba(30, 100, 250, 0.25);
              box-shadow: 0 4px 12px rgba(30, 100, 250, 0.1);
            }
          `;
          document.head.appendChild(style);

          // Create Segmented Control container
          const segmentedControl = document.createElement('div');
          segmentedControl.className = 'ios-segmented-control';
          
          subItems.forEach((subItem) => {
            const btn = document.createElement('button');
            btn.className = 'ios-segment-btn';
            btn.textContent = subItem.textContent.trim();
            
            if (subItem.classList.contains('active')) {
              btn.classList.add('active');
            }
            
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              segmentedControl.querySelectorAll('.ios-segment-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              subItem.click();
            });
            
            segmentedControl.appendChild(btn);
          });
          
          const header = mainContent.querySelector('.dashboard-header');
          if (header) {
            header.appendChild(segmentedControl);
          } else {
            mainContent.insertBefore(segmentedControl, mainContent.firstChild);
          }
        }
      }
    });
  }

  // Aplicar tema guardado antes de que cargue el DOM (evita flash)
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  // Íconos en SVG propio: no dependen de librerías externas (antes usaba Phosphor,
  // que solo se cargaba en dos páginas y dejaba el botón sin ícono en las demás).
  const ICONO_LUNA = '<svg class="theme-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const ICONO_SOL = '<svg class="theme-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btnTheme';
    btn.className = 'nav-item theme-switch';
    btn.setAttribute('role', 'switch');

    function pintar() {
      const esClaro = document.documentElement.classList.contains('light-mode');
      btn.setAttribute('aria-checked', esClaro ? 'false' : 'true');
      btn.setAttribute('aria-label', 'Tema oscuro');
      btn.innerHTML = (esClaro ? ICONO_LUNA : ICONO_SOL) +
        '<span>' + (esClaro ? 'Tema oscuro' : 'Tema claro') + '</span>';
    }

    pintar();
    footer.insertBefore(btn, footer.firstChild);

    btn.addEventListener('click', function () {
      const esClaro = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem(STORAGE_KEY, esClaro ? 'light' : 'dark');
      pintar();
    });
  });
})();