/* ===========================
   Infra Stepper — diagrama interactivo de "de un servidor a arquitectura escalable"
   Componente genérico: no conoce el dominio (app/BD/Redis…), solo lee atributos
   data-* del HTML. Cargado únicamente en el artículo que lo usa.
   =========================== */
(function () {
  const root = document.querySelector('.infra-stepper');
  if (!root) return;

  const nav = root.querySelector('.infra-stepper-nav');
  const diagram = root.querySelector('.infra-diagram');
  const svg = root.querySelector('.infra-connectors');
  const caption = root.querySelector('.infra-step-caption');
  const stepLink = root.querySelector('.infra-step-link');
  const buttons = [...root.querySelectorAll('.infra-step-btn')];
  const nodes = [...diagram.querySelectorAll('.infra-node, .infra-group')];
  const connMeta = [...diagram.querySelectorAll('.infra-conn')];
  const legends = [...root.querySelectorAll('[data-step-title]')];
  const scroller = nav.closest('.tabs-scroller');
  const prevArrow = scroller?.querySelector('.tabs-arrow--prev');
  const nextArrow = scroller?.querySelector('.tabs-arrow--next');

  const STEP_MIN = 1;
  const STEP_MAX = buttons.length;
  let currentStep = 1;
  let rectCache = new Map();

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => reduceMotionQuery.matches;

  /* ---- Geometría de los conectores (recalculada solo al cargar y al redimensionar) ---- */
  function recomputeRects() {
    const hostRect = diagram.getBoundingClientRect();
    rectCache = new Map();
    diagram.querySelectorAll('.infra-node[data-node]').forEach(node => {
      const r = node.getBoundingClientRect();
      rectCache.set(node.dataset.node, {
        cx: r.left - hostRect.left + r.width / 2,
        cy: r.top - hostRect.top + r.height / 2,
        top: r.top - hostRect.top,
        bottom: r.bottom - hostRect.top,
        left: r.left - hostRect.left,
        right: r.right - hostRect.left
      });
    });
    svg.setAttribute('viewBox', `0 0 ${hostRect.width} ${hostRect.height}`);
    buildConnectorPaths();
  }

  const CORNER_RADIUS = 10;
  const ALIGN_TOLERANCE = 6; // por debajo de esto, ya se considera "alineado": línea recta sin codo

  // Construye una ruta ortogonal (en ángulo recto) entre dos cajas, en vez de
  // una diagonal directa: sale por el lado de "a" más cercano a "b" y entra
  // por el lado opuesto de "b", con un tramo intermedio en "Z" si no están
  // alineadas en esa misma coordenada.
  function orthogonalRoute(a, b) {
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    if (Math.abs(dy) >= Math.abs(dx)) {
      const goingDown = dy > 0;
      const p1 = { x: a.cx, y: goingDown ? a.bottom : a.top };
      const p2 = { x: b.cx, y: goingDown ? b.top : b.bottom };
      if (Math.abs(p2.x - p1.x) < ALIGN_TOLERANCE) {
        return [p1, { x: p1.x, y: p2.y }];
      }
      const midY = (p1.y + p2.y) / 2;
      return [p1, { x: p1.x, y: midY }, { x: p2.x, y: midY }, p2];
    }
    const goingRight = dx > 0;
    const p1 = { x: goingRight ? a.right : a.left, y: a.cy };
    const p2 = { x: goingRight ? b.left : b.right, y: b.cy };
    if (Math.abs(p2.y - p1.y) < ALIGN_TOLERANCE) {
      return [p1, { x: p2.x, y: p1.y }];
    }
    const midX = (p1.x + p2.x) / 2;
    return [p1, { x: midX, y: p1.y }, { x: midX, y: p2.y }, p2];
  }

  // Traza un polígono (lista de puntos) como un path SVG, redondeando cada
  // vértice interior con una curva cuadrática de radio fijo (recortado si el
  // tramo es más corto que el radio), al estilo de los diagramas de AWS.
  function roundedPath(points, r) {
    if (points.length < 3) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    let d = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const next = points[i + 1];
      const d1 = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      const d2 = Math.hypot(next.x - cur.x, next.y - cur.y);
      const rr = Math.min(r, d1 / 2, d2 / 2);
      const t1 = d1 ? 1 - rr / d1 : 1;
      const t2 = d2 ? rr / d2 : 0;
      const p1 = { x: prev.x + (cur.x - prev.x) * t1, y: prev.y + (cur.y - prev.y) * t1 };
      const p2 = { x: cur.x + (next.x - cur.x) * t2, y: cur.y + (next.y - cur.y) * t2 };
      d += `L ${p1.x} ${p1.y} Q ${cur.x} ${cur.y} ${p2.x} ${p2.y} `;
    }
    const last = points[points.length - 1];
    d += `L ${last.x} ${last.y}`;
    return d;
  }

  function buildConnectorPaths() {
    svg.innerHTML = '';
    connMeta.forEach(meta => {
      const from = rectCache.get(meta.dataset.from);
      const to = rectCache.get(meta.dataset.to);
      if (!from || !to) return;
      const points = orthogonalRoute(from, to);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('data-conn-for', `${meta.dataset.from}-${meta.dataset.to}`);
      path.setAttribute('d', roundedPath(points, CORNER_RADIUS));
      const addStep = Number(meta.dataset.stepAdd);
      const removeStep = meta.dataset.stepRemove ? Number(meta.dataset.stepRemove) : null;
      if (addStep <= currentStep && (removeStep === null || currentStep < removeStep)) {
        path.classList.add('is-present');
      }
      svg.appendChild(path);
    });
  }

  /* ---- Tabs: centrar el activo + flechas prev/siguiente (mismo patrón que en
     js/main.js para los tabs de Proyectos; se duplica porque no hay módulos) ---- */
  function centerTabInScroller(scrollerEl, tab, smooth) {
    if (!scrollerEl || !tab) return;
    const target = tab.offsetLeft - (scrollerEl.clientWidth / 2) + (tab.offsetWidth / 2);
    const max = scrollerEl.scrollWidth - scrollerEl.clientWidth;
    const clamped = Math.max(0, Math.min(target, max));
    scrollerEl.scrollTo({ left: clamped, behavior: smooth ? 'smooth' : 'auto' });
  }

  function updateTabArrows(scrollerEl, prevBtn, nextBtn) {
    if (!scrollerEl || !prevBtn || !nextBtn) return;
    const hasOverflow = scrollerEl.scrollWidth > scrollerEl.clientWidth + 1;
    prevBtn.hidden = nextBtn.hidden = !hasOverflow;
    if (!hasOverflow) return;
    prevBtn.disabled = scrollerEl.scrollLeft <= 0;
    nextBtn.disabled = scrollerEl.scrollLeft >= scrollerEl.scrollWidth - scrollerEl.clientWidth - 1;
  }

  function updateStepLink(n) {
    const legend = legends.find(li => Number(li.dataset.step) === n);
    if (!legend || !stepLink) return;
    stepLink.href = legend.dataset.stepHref || `#paso-${n}`;
    stepLink.textContent = `Ver explicación completa del paso ${n} →`;
  }

  /* ---- Cambio de paso ---- */
  function activateStep(n) {
    n = Math.min(STEP_MAX, Math.max(STEP_MIN, n));
    const goingForward = n > currentStep;
    currentStep = n;

    buttons.forEach(btn => {
      const step = Number(btn.dataset.step);
      const isActive = step === n;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
      if (isActive) diagram.setAttribute('aria-labelledby', btn.id);
    });

    nodes.forEach(el => {
      const addStep = Number(el.dataset.stepAdd);
      const removeStep = el.dataset.stepRemove ? Number(el.dataset.stepRemove) : null;
      const shouldShow = addStep <= n && (removeStep === null || n < removeStep);
      const wasShown = el.classList.contains('is-present');
      el.classList.toggle('is-present', shouldShow);
      if (shouldShow && !wasShown && goingForward && !reduceMotion()) {
        el.classList.remove('infra-appear');
        void el.offsetWidth; // reflow: permite re-disparar la animación aunque ya se hubiera usado antes
        el.classList.add('infra-appear');
      }
    });

    connMeta.forEach(meta => {
      const addStep = Number(meta.dataset.stepAdd);
      const removeStep = meta.dataset.stepRemove ? Number(meta.dataset.stepRemove) : null;
      const shouldShow = addStep <= n && (removeStep === null || n < removeStep);
      const path = svg.querySelector(`[data-conn-for="${meta.dataset.from}-${meta.dataset.to}"]`);
      if (!path) return;
      path.classList.toggle('is-present', shouldShow);
      if (shouldShow && goingForward && addStep === n && !reduceMotion()) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        void path.offsetWidth;
        path.style.transition = 'stroke-dashoffset 0.6s ease, opacity 0.3s ease';
        path.style.strokeDashoffset = '0';
      } else if (shouldShow) {
        path.style.transition = '';
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
      }
    });

    const legend = legends.find(li => Number(li.dataset.step) === n);
    if (legend && caption) {
      caption.textContent = `Paso ${n}: ${legend.dataset.stepTitle}. ${legend.textContent}`;
    }

    updateStepLink(n);
    centerTabInScroller(nav, buttons[n - 1], !reduceMotion());
    updateTabArrows(nav, prevArrow, nextArrow);
  }

  /* ---- Interacción: clic (activa el paso y desplaza hasta su explicación) ---- */
  function goToScene(step) {
    const scene = document.getElementById(`paso-${step}`);
    if (scene) scene.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      activateStep(Number(btn.dataset.step));
      btn.focus();
      goToScene(Number(btn.dataset.step));
    });
  });

  stepLink?.addEventListener('click', (e) => {
    const href = stepLink.getAttribute('href');
    const scene = href && document.querySelector(href);
    if (!scene) return;
    e.preventDefault();
    scene.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  prevArrow?.addEventListener('click', () => buttons[Math.max(0, currentStep - 2)].click());
  nextArrow?.addEventListener('click', () => buttons[Math.min(buttons.length - 1, currentStep)].click());
  window.addEventListener('resize', () => updateTabArrows(nav, prevArrow, nextArrow));

  /* ---- Interacción: teclado (patrón APG de tablist, roving tabindex) ---- */
  nav.addEventListener('keydown', (e) => {
    const idx = buttons.findIndex(b => b === document.activeElement);
    if (idx === -1) return;
    let next = null;
    if (e.key === 'ArrowRight') next = buttons[Math.min(idx + 1, buttons.length - 1)];
    else if (e.key === 'ArrowLeft') next = buttons[Math.max(idx - 1, 0)];
    else if (e.key === 'Home') next = buttons[0];
    else if (e.key === 'End') next = buttons[buttons.length - 1];
    if (next) {
      e.preventDefault();
      next.focus();
      activateStep(Number(next.dataset.step));
      goToScene(Number(next.dataset.step));
    }
  });

  /* ---- Recalcular geometría al cargar y al redimensionar ---- */
  let resizeTimer = null;
  function scheduleRecompute() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recomputeRects, 120);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recomputeRects);
  } else {
    recomputeRects();
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(scheduleRecompute).observe(diagram);
  } else {
    window.addEventListener('resize', scheduleRecompute);
  }
  window.addEventListener('orientationchange', scheduleRecompute);

  /* ---- Scroll-sync: en escritorio ancho (layout de 2 columnas), el paso activo
     sigue a la sección de texto que se esté leyendo, sin mover el scroll él
     mismo (nunca llama a scrollIntoView, solo a activateStep). ---- */
  const scrollScenes = [...document.querySelectorAll('.infra-scene[data-scroll-step]')];
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const NAVBAR_OFFSET = 88;   // ~5.5rem, igual que .infra-scroll-diagram/.infra-scene
  const TRIGGER_RATIO = 0.45; // 45% de la altura útil del viewport, bajo el navbar

  let scrollSyncActive = false;
  let scrollRafId = null;

  function triggerLineY() {
    return NAVBAR_OFFSET + (window.innerHeight - NAVBAR_OFFSET) * TRIGGER_RATIO;
  }

  function syncStepFromScroll() {
    scrollRafId = null;
    if (!scrollScenes.length) return;
    const line = triggerLineY();
    let candidate = scrollScenes[0];
    for (const scene of scrollScenes) {
      if (scene.getBoundingClientRect().top <= line) candidate = scene;
      else break; // las escenas están en orden de documento: superada la línea, las siguientes tampoco la cruzan
    }
    const step = Number(candidate.dataset.scrollStep);
    if (step !== currentStep) activateStep(step);
  }

  function onScroll() {
    if (!scrollSyncActive || scrollRafId) return;
    scrollRafId = requestAnimationFrame(syncStepFromScroll);
  }

  function enableScrollSync() {
    if (scrollSyncActive) return;
    scrollSyncActive = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    syncStepFromScroll();
  }

  function disableScrollSync() {
    if (!scrollSyncActive) return;
    scrollSyncActive = false;
    window.removeEventListener('scroll', onScroll);
    if (scrollRafId) { cancelAnimationFrame(scrollRafId); scrollRafId = null; }
  }

  desktopQuery.addEventListener('change', (e) => {
    if (e.matches) enableScrollSync(); else disableScrollSync();
  });

  if (desktopQuery.matches) enableScrollSync();

  activateStep(1);
})();
