// ascii-fx.js — interactive ASCII particle effects

(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&[]{}|~<>/\\;:_-+=^·×';

  function randChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  // Spawn one floating ASCII char at (x, y), then animate to final offset.
  function spawnParticle(x, y, { dx = 0, dy = -32, duration = 700, opacity = 0.65 } = {}) {
    const el = document.createElement('span');
    el.className = 'ascii-particle';
    el.textContent = randChar();
    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.opacity = opacity;
    document.body.appendChild(el);

    // Force reflow so initial state is committed before transition starts
    el.getBoundingClientRect();

    el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    el.style.transform  = `translate(${dx}px, ${dy}px)`;
    el.style.opacity    = '0';

    setTimeout(() => el.remove(), duration + 60);
  }

  // ── Cursor trail ──────────────────────────────────────────────

  let lastTrail = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 75) return;
    lastTrail = now;

    spawnParticle(e.clientX, e.clientY, {
      dx:       (Math.random() - 0.5) * 22,
      dy:       -(18 + Math.random() * 22),
      duration: 620,
      opacity:  0.6,
    });
  });

  // ── Hero click burst ──────────────────────────────────────────

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('click', (e) => {
      const count = 20;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const dist  = 70 + Math.random() * 90;
        const delay = Math.random() * 80;

        setTimeout(() => {
          spawnParticle(e.clientX, e.clientY, {
            dx:       Math.cos(angle) * dist,
            dy:       Math.sin(angle) * dist,
            duration: 750 + Math.random() * 300,
            opacity:  0.8,
          });
        }, delay);
      }
    });
  }

  // ── Nav link scramble on hover ────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof TextScramble === 'undefined') return;

    document.querySelectorAll('.topbar-nav a').forEach((el) => {
      const original = el.textContent.trim();
      const sc = new TextScramble(el);

      el.addEventListener('mouseenter', () => {
        sc.setText(original, { stagger: 22 });
      });
    });
  });

})();
