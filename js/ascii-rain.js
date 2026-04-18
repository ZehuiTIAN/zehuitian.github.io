// ascii-rain.js
// Sparse column-based character fall behind the hero section.
// Throttled to ~20 fps; clears each frame for a crisp (no-trail) look.

(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&[]{}|~<>/\\;:_-+=^·×';
  const FONT_SIZE   = 13;
  const OPACITY     = 0.18;
  const SPEED       = 0.35;   // rows per frame
  const FRAME_MS    = 50;     // ~20 fps

  function init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position:      'absolute',
      top:           '0',
      left:          '0',
      width:         '100%',
      height:        '100%',
      pointerEvents: 'none',
      zIndex:        '0',
    });
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let cols, drops;

    function resize() {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      cols  = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < FRAME_MS) return;
      last = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font      = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(10,10,10,${OPACITY})`;

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        drops[i] += SPEED;
        if (drops[i] * FONT_SIZE > canvas.height) {
          drops[i] = Math.random() * -40;
        }
      }
    }

    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
