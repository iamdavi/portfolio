/* ===========================
   Shared site chrome: custom cursor, particles background, Lucide icons.
   Used on every page (home, blog, legal) so the visual identity is consistent.
   =========================== */

/* ---- Custom Cursor ---- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
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

  document.querySelectorAll('a, button, .skill-card, .contact-card, .aws-service, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
  });
}

/* ---- Lucide Icons ---- */
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

/* ---- Particles background ---- */
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
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
