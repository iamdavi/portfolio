/* ===========================
   Navbar (todas las páginas): scroll, menú móvil, acordeón de Servicios y cierre con Escape.
   El desplegable de escritorio funciona con CSS (hover/foco) y todos los enlaces están siempre en el HTML.
   =========================== */
(function () {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  var hamburger = nav.querySelector('.hamburger');
  var links = nav.querySelector('.nav-links');
  var sub = nav.querySelector('.has-sub');
  var subToggle = nav.querySelector('.sub-toggle');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setSub(open) {
    if (!sub) return;
    sub.classList.toggle('sub-open', open);
    if (subToggle) subToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setOpen(open) {
    hamburger.classList.toggle('open', open);
    links.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    if (!open || !sub) return;
    // Si estamos dentro de Servicios, el acordeón se abre con la sección actual visible
    var current = sub.querySelector('.nav-sub [aria-current]');
    setSub(!!sub.querySelector('[aria-current]'));
    if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest' });
  }

  hamburger.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });
  if (subToggle) {
    subToggle.addEventListener('click', function () {
      setSub(!sub.classList.contains('sub-open'));
    });
  }
  // En fase de captura: el menú se cierra antes de que actúe el scroll suave de los anclajes
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  }, true);
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
