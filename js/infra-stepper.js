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
  const buttons = [...root.querySelectorAll('.infra-step-btn')];
  const nodes = [...diagram.querySelectorAll('.infra-node, .infra-group')];
  const connMeta = [...diagram.querySelectorAll('.infra-conn')];
  const legends = [...root.querySelectorAll('[data-step-title]')];

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

  function anchorPoint(a, b) {
    // Ancla la línea al borde de la caja más cercano al otro nodo, no al centro,
    // para que no atraviese el texto.
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    if (Math.abs(dy) >= Math.abs(dx)) {
      return { x: a.cx, y: dy > 0 ? a.bottom : a.top };
    }
    return { x: dx > 0 ? a.right : a.left, y: a.cy };
  }

  function buildConnectorPaths() {
    svg.innerHTML = '';
    connMeta.forEach(meta => {
      const from = rectCache.get(meta.dataset.from);
      const to = rectCache.get(meta.dataset.to);
      if (!from || !to) return;
      const p1 = anchorPoint(from, to);
      const p2 = anchorPoint(to, from);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('data-conn-for', `${meta.dataset.from}-${meta.dataset.to}`);
      path.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      const addStep = Number(meta.dataset.stepAdd);
      const removeStep = meta.dataset.stepRemove ? Number(meta.dataset.stepRemove) : null;
      if (addStep <= currentStep && (removeStep === null || currentStep < removeStep)) {
        path.classList.add('is-present');
      }
      svg.appendChild(path);
    });
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
  }

  /* ---- Interacción: clic ---- */
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      activateStep(Number(btn.dataset.step));
      btn.focus();
    });
  });

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

  activateStep(1);
})();
