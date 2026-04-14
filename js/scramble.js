// TextScramble — letter decode animation.
// Characters cycle through random symbols before "locking" to the correct value,
// left-to-right with a stagger so it reads like a scan decoding the text.

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*[]{}|?~';

class TextScramble {
  constructor(el) {
    this.el   = el;
    this._raf = null;
  }

  setText(text, { stagger = 55 } = {}) {
    const len    = text.length;
    const states = Array.from({ length: len }, (_, i) => ({
      final:  text[i],
      locked: false,
      lockAt: 180 + i * stagger + Math.random() * 100,
    }));

    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;

      let html = '';
      let allLocked = true;

      for (let i = 0; i < len; i++) {
        const s = states[i];
        if (s.final === ' ') { html += ' '; continue; }

        if (!s.locked && elapsed >= s.lockAt) s.locked = true;

        if (s.locked) {
          html += `<span class="scramble-char scramble-locked">${s.final}</span>`;
        } else {
          allLocked = false;
          const rand = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          html += `<span class="scramble-char scramble-noise">${rand}</span>`;
        }
      }

      this.el.innerHTML = html;

      if (!allLocked) {
        this._raf = requestAnimationFrame(tick);
      } else {
        // Clean DOM — replace span soup with plain text
        this.el.textContent = text;
      }
    };

    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(tick);
  }
}

// Auto-init on elements with [data-scramble]
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('[data-scramble]');
  if (!el) return;

  const target   = el.dataset.scramble;
  const scrambler = new TextScramble(el);

  // Small delay so fonts are loaded and layout is stable
  setTimeout(() => scrambler.setText(target, { stagger: 55 }), 120);

  // Re-play on hover (faster)
  el.addEventListener('mouseenter', () => {
    scrambler.setText(target, { stagger: 28 });
  });
});
