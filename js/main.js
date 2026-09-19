/* ===========================
   Custom Cursor
   =========================== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  document.body.classList.add('cursor-visible');
});

function animateFollower() {
  followerX += (cursorX - followerX) * 0.12;
  followerY += (cursorY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-visible'));

document.querySelectorAll('a, button, .skill-card, .contact-card, .aws-service').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
});

/* ===========================
   Navbar Scroll
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===========================
   Mobile Menu
   =========================== */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

/* ===========================
   Smooth Scroll
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===========================
   Typewriter Effect
   =========================== */
const phrases = ['Fullstack Developer', 'Vibe Coder', 'AWS Engineer', 'Problem Solver', 'Tech Lead'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.querySelector('.typewriter-text');

function type() {
  const phrase = phrases[phraseIdx];
  typeEl.textContent = deleting
    ? phrase.substring(0, charIdx - 1)
    : phrase.substring(0, charIdx + 1);

  if (deleting) charIdx--;
  else charIdx++;

  let delay = deleting ? 55 : 95;
  if (!deleting && charIdx === phrase.length) { delay = 2200; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 450; }

  setTimeout(type, delay);
}

type();

/* ===========================
   Skills Tabs
   =========================== */
function staggerCards(panel) {
  const cards = panel.querySelectorAll('.skill-card, .soft-skill-item, .aws-service');
  cards.forEach((card, i) => {
    card.classList.remove('animate');
    void card.offsetWidth;
    card.style.animationDelay = `${i * 55}ms`;
    card.classList.add('animate');
  });
}

function activateTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => {
    const isActive = p.id === `tab-${name}`;
    p.classList.toggle('active', isActive);
    if (isActive) staggerCards(p);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

activateTab('frontend');

/* ===========================
   Intersection Observer — Reveal
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===========================
   Language Bars
   =========================== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width;
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.language-bar-fill').forEach(bar => {
  bar.style.width = '0';
  barObserver.observe(bar);
});

/* ===========================
   Print CV
   =========================== */
document.getElementById('btn-print')?.addEventListener('click', () => window.print());

/* ===========================
   Contact Form (Formspree)
   =========================== */
const contactForm   = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactBtn    = document.getElementById('contact-submit');
const contactBtnTxt = document.getElementById('contact-btn-text');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const privacyConsent = document.getElementById('privacy-consent');
  if (privacyConsent && !privacyConsent.checked) {
    contactStatus.textContent = 'Debes aceptar la Política de Privacidad para enviar el mensaje.';
    contactStatus.className   = 'contact-status error';
    return;
  }

  contactBtn.disabled  = true;
  contactBtnTxt.textContent = 'Enviando…';
  contactStatus.textContent = '';
  contactStatus.className   = 'contact-status';

  try {
    const res = await fetch(contactForm.action, {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(contactForm)
    });

    if (res.ok) {
      contactStatus.textContent = '¡Mensaje enviado! Te respondo en menos de 24 horas.';
      contactStatus.className   = 'contact-status success';
      contactForm.reset();
    } else {
      const data = await res.json();
      const msg  = data?.errors?.map(e => e.message).join(', ') || 'Error al enviar. Inténtalo de nuevo.';
      contactStatus.textContent = msg;
      contactStatus.className   = 'contact-status error';
    }
  } catch {
    contactStatus.textContent = 'Error de red. Comprueba tu conexión e inténtalo de nuevo.';
    contactStatus.className   = 'contact-status error';
  } finally {
    contactBtn.disabled       = false;
    contactBtnTxt.textContent = 'Enviar mensaje';
  }
});

/* ===========================
   CV Scale
   =========================== */
function scaleCv() {
  const wrapper = document.querySelector('.cv-wrapper');
  const scroll  = document.querySelector('.cv-scroll');
  if (!wrapper || !scroll) return;

  const naturalWidth = 900;
  const available = scroll.parentElement.offsetWidth;

  if (available >= naturalWidth) {
    wrapper.style.transform       = '';
    wrapper.style.transformOrigin = '';
    wrapper.style.marginLeft      = '';
    scroll.style.height           = '';
    return;
  }

  const scale = available / naturalWidth;

  // Reset transform to measure natural height accurately
  wrapper.style.transform = 'none';
  const naturalHeight = wrapper.offsetHeight;

  // transform-origin: top left + marginLeft: 0 ensures the scaled visual
  // width (naturalWidth * scale = available) fills the container exactly,
  // without the left-drift that top center causes on overflowing elements.
  wrapper.style.transformOrigin = 'top left';
  wrapper.style.marginLeft      = '0';
  wrapper.style.transform       = `scale(${scale})`;
  scroll.style.height           = (naturalHeight * scale) + 'px';
}

scaleCv();
window.addEventListener('resize', scaleCv);

/* ===========================
   Lucide Icons
   =========================== */
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

/* ===========================
   Particles
   =========================== */
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    particles: {
      number: { value: 55, density: { enable: true, value_area: 900 } },
      color: { value: '#6ec4a0' },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.2, sync: false } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 140, color: '#6ec4a0', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 0.7, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }
    },
    retina_detect: true
  });
}
