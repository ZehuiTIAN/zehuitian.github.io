// Renders homepage content sections from CONTENT_INDEX + I18n.

let _activeTag = null;

// ── Writing section ─────────────────────────────────────────────

function getUniqueTags() {
  const seen = new Set();
  CONTENT_INDEX.writing.forEach(item => {
    (item.tags || []).forEach(t => seen.add(t));
  });
  return Array.from(seen);
}

function renderTagFilter(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const allLabel = I18n.t('filter.all');
  const tags     = getUniqueTags();

  el.innerHTML = [
    `<button class="tag-pill${_activeTag === null ? ' active' : ''}" data-tag="">${allLabel}</button>`,
    ...tags.map(t =>
      `<button class="tag-pill${_activeTag === t ? ' active' : ''}" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`
    )
  ].join('');

  el.querySelectorAll('.tag-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTag = btn.dataset.tag || null;
      renderTagFilter(containerId);
      renderWritingList('writing-list');
    });
  });
}

function renderWritingList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const lang = I18n.getLang();

  let items = CONTENT_INDEX.writing.slice();
  if (_activeTag) {
    items = items.filter(item => (item.tags || []).includes(_activeTag));
  }
  items.sort((a, b) => b.date.localeCompare(a.date));

  if (items.length === 0) {
    el.innerHTML = `<li class="post-item"><p class="empty-state">${I18n.t('empty.soon')}</p></li>`;
    return;
  }

  el.innerHTML = items.map(item => {
    const title  = typeof item.title === 'object' ? (item.title[lang] || item.title.zh) : item.title;
    const desc   = typeof item.desc  === 'object' ? (item.desc[lang]  || item.desc.zh)  : (item.desc || '');
    const url    = `article.html?type=${encodeURIComponent(item.dir)}&slug=${encodeURIComponent(item.slug)}`;
    const tagHtml = (item.tags || [])
      .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
      .join('');

    return `
      <li class="post-item">
        <span class="post-date">${item.date}</span>
        <div class="post-info">
          <a class="post-title" href="${url}">${escapeHtml(title)}</a>
          ${desc ? `<p class="post-desc">${escapeHtml(desc)}</p>` : ''}
          ${tagHtml ? `<div class="post-tags">${tagHtml}</div>` : ''}
        </div>
      </li>
    `;
  }).join('');
}

// ── Music section ────────────────────────────────────────────────

function renderMusicList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const lang  = I18n.getLang();
  const items = CONTENT_INDEX.music;

  if (!items || items.length === 0) {
    el.innerHTML = `<li><p class="empty-state">${I18n.t('empty.soon')}</p></li>`;
    return;
  }

  el.innerHTML = items.map(item => {
    const desc = typeof item.desc === 'object' ? (item.desc[lang] || item.desc.zh) : (item.desc || '');
    const metaParts = [];
    if (item.composer) metaParts.push(item.composer);
    if (item.arranger && item.arranger !== item.composer) metaParts.push('arr. ' + item.arranger);
    if (item.year) metaParts.push(item.year);
    const meta = metaParts.join(' · ');

    const pdfHtml = item.pdf
      ? `<a class="score-link" href="${item.pdf}" target="_blank" rel="noopener">${I18n.t('music.pdf')}</a>`
      : `<span class="score-link" style="opacity:0.35;cursor:default;border-bottom:none">${I18n.t('music.no-pdf')}</span>`;

    return `
      <li class="score-item">
        <div class="score-info">
          <div class="score-title">${escapeHtml(item.title)}</div>
          <div class="score-meta">${escapeHtml(desc)}${meta ? ' · ' + escapeHtml(meta) : ''}</div>
        </div>
        ${pdfHtml}
      </li>
    `;
  }).join('');
}

// ── Games / Tools section ─────────────────────────────────────────

function renderGameGrid(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const lang  = I18n.getLang();
  const items = CONTENT_INDEX.games;

  if (!items || items.length === 0) {
    el.innerHTML = `<p class="empty-state">${I18n.t('empty.soon')}</p>`;
    return;
  }

  el.innerHTML = items.map(item => {
    const title   = typeof item.title === 'object' ? (item.title[lang] || item.title.zh) : item.title;
    const desc    = typeof item.desc  === 'object' ? (item.desc[lang]  || item.desc.zh)  : (item.desc || '');
    const techHtml = (item.tech || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');

    return `
      <a class="game-card" href="${item.url}">
        <div class="game-card-title">${escapeHtml(title)}</div>
        <div class="game-card-desc">${escapeHtml(desc)}</div>
        ${techHtml ? `<div class="game-card-tech">${techHtml}</div>` : ''}
      </a>
    `;
  }).join('');
}

// ── Journal section ──────────────────────────────────────────────

function renderJournalList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const items = (CONTENT_INDEX.journal || []).slice();
  items.sort((a, b) => b.date.localeCompare(a.date)); // newest first

  if (!items.length) {
    el.innerHTML = `<p class="empty-state">${I18n.t('empty.soon')}</p>`;
    return;
  }

  el.innerHTML = items.map((item, i) => {
    const title   = item.title ? escapeHtml(item.title) : item.date;
    const moodHtml = item.mood ? `<span class="journal-mood" aria-hidden="true">${item.mood}</span>` : '';
    return `
      <div class="journal-item" data-idx="${i}" data-slug="${item.slug}" data-dir="${item.dir || 'journal'}">
        <button class="journal-header" aria-expanded="false">
          <span class="journal-date">${item.date}</span>
          <span class="journal-title">${title}</span>
          ${moodHtml}
          <span class="journal-arrow" aria-hidden="true">+</span>
        </button>
        <div class="journal-body-wrap" role="region">
          <div class="journal-body-inner">
            <div class="journal-body prose"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Wire accordion click handlers
  el.querySelectorAll('.journal-item').forEach(item => {
    const btn    = item.querySelector('.journal-header');
    const body   = item.querySelector('.journal-body');
    let   loaded = false;

    btn.addEventListener('click', async () => {
      const isOpen = item.classList.contains('open');

      if (!isOpen && !loaded) {
        body.textContent = I18n.t('journal.loading');
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');

        const slug = item.dataset.slug;
        const dir  = item.dataset.dir;
        try {
          const res = await fetch(`content/${dir}/${slug}.md`);
          if (res.ok) {
            body.innerHTML = (typeof Markdown !== 'undefined')
              ? Markdown.parse(await res.text())
              : `<pre>${escapeHtml(await res.text())}</pre>`;
          } else {
            body.textContent = I18n.t('journal.error');
          }
        } catch (_) {
          body.textContent = I18n.t('journal.error');
        }
        loaded = true;
      } else {
        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      }
    });
  });
}

// ── Shared ───────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAll() {
  renderTagFilter('writing-filter');
  renderWritingList('writing-list');
  renderJournalList('journal-list');
  renderMusicList('music-list');
  renderGameGrid('games-grid');
}

// Active nav highlight via IntersectionObserver
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topbar-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  initNavHighlight();
});

// Called by i18n.js on language switch
function onLangChange() {
  renderAll();
}
