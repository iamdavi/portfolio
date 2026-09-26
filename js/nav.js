/* ===========================
   Navbar (páginas interiores): scroll, menú móvil y cierre con Escape.
   El desplegable de Servicios funciona con CSS (hover/foco) y sus enlaces están siempre en el HTML.
   =========================== */
(function () {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  var hamburger = nav.querySelector('.hamburger');
  var links = nav.querySelector('.nav-links');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setOpen(open) {
    hamburger.classList.toggle('open', open);
    links.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  hamburger.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
