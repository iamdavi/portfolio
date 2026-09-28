/* ===========================
   Theme toggle (todas las páginas): localStorage + prefers-color-scheme.
   =========================== */
(function () {
  var STORAGE_KEY = 'theme';

  function readTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function writeTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage no disponible (modo privado, etc.) */
    }
  }

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f6f4' : '#0c0c0f');
  }

  applyTheme(currentTheme());

  btn.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light';
    writeTheme(next);
    applyTheme(next);
  });
})();
