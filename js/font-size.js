(function() {
  const STORAGE_KEY = 'boncloud-fontsize';
  const SIZES = [
    { label: 'A-', value: '14px', id: 'size-sm' },
    { label: 'A', value: '16px', id: 'size-md' },
    { label: 'A+', value: '18px', id: 'size-lg' }
  ];
  
  function applyFontSize(size) {
    document.documentElement.style.fontSize = size;
    localStorage.setItem(STORAGE_KEY, size);
    
    // update active state
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      if (btn.dataset.size === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inject the CSS
    const style = document.createElement('style');
    style.textContent = `
      .font-size-controls {
        position: fixed;
        top: 16px;
        right: 140px; /* To the left of the theme button */
        z-index: 9999;
        display: flex;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 195, 255, 0.25);
        border-radius: 30px;
        overflow: hidden;
      }
      body.light-mode .font-size-controls,
      .light-mode .font-size-controls {
        background: rgba(255, 255, 255, 0.85);
        border-color: rgba(30, 80, 160, 0.35);
      }
      .font-size-btn {
        background: transparent;
        border: none;
        color: #90cfe8;
        padding: 7px 12px;
        font-size: 12px;
        font-family: 'SF Pro Display', 'Inter', -apple-system, sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s;
      }
      body.light-mode .font-size-btn,
      .light-mode .font-size-btn {
        color: #0f172a;
      }
      .font-size-btn:hover {
        background: rgba(0, 80, 120, 0.5);
        color: #d4f0ff;
      }
      body.light-mode .font-size-btn:hover,
      .light-mode .font-size-btn:hover {
        background: rgba(30, 80, 160, 0.1);
      }
      .font-size-btn.active {
        background: rgba(0, 195, 255, 0.3);
        color: #fff;
      }
      body.light-mode .font-size-btn.active,
      .light-mode .font-size-btn.active {
        background: rgba(30, 80, 160, 0.2);
        color: #0f172a;
      }
      
      /* In iframes, move controls inside so they aren't hidden */
      html.in-iframe .font-size-controls {
        top: 10px;
        right: 10px;
      }
    `;
    document.head.appendChild(style);

    // Create the controls container
    const container = document.createElement('div');
    container.className = 'font-size-controls';

    SIZES.forEach(sizeObj => {
      const btn = document.createElement('button');
      btn.className = 'font-size-btn';
      btn.dataset.size = sizeObj.value;
      btn.textContent = sizeObj.label;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyFontSize(sizeObj.value);
      });
      container.appendChild(btn);
    });

    document.body.appendChild(container);

    // Apply saved or default
    const saved = localStorage.getItem(STORAGE_KEY) || '16px';
    applyFontSize(saved);
  });
  
  // Apply saved early to prevent flash, before DOM is loaded
  const savedEarly = localStorage.getItem(STORAGE_KEY);
  if (savedEarly) {
    document.documentElement.style.fontSize = savedEarly;
  }
})();
