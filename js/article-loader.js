// Loads and renders a single markdown article.
// URL params: ?type=essays|tech-notes  &slug=filename-without-extension
// The `type` param maps to the `dir` field in CONTENT_INDEX.writing.

(function () {

  async function load() {
    const params = new URLSearchParams(location.search);
    const dir    = params.get('type');   // maps to item.dir
    const slug   = params.get('slug');

    if (!dir || !slug) { showError('Invalid article URL.'); return; }

    // Look up metadata from writing index
    const item = (typeof CONTENT_INDEX !== 'undefined')
      ? (CONTENT_INDEX.writing || []).find(e => e.slug === slug && e.dir === dir)
      : null;

    // Determine prose class from item type
    const proseClass = (item && item.type === 'tech') ? 'prose prose-tech' : 'prose';

    // Fetch markdown — try lang-specific variant first
    const lang = typeof I18n !== 'undefined' ? I18n.getLang() : 'zh';
    const candidates = lang === 'en'
      ? [`content/${dir}/${slug}.en.md`, `content/${dir}/${slug}.md`]
      : [`content/${dir}/${slug}.md`];

    let text = null;
    for (const path of candidates) {
      try {
        const res = await fetch(path);
        if (res.ok) { text = await res.text(); break; }
      } catch (_) {}
    }

    if (text === null) {
      showError(typeof I18n !== 'undefined' ? I18n.t('article.error') : 'Failed to load.');
      return;
    }

    render(text, proseClass, item);
  }

  function render(md, proseClass, item) {
    // Extract title from first H1
    const stripped   = md.replace(/^<!--[\s\S]*?-->\n?/, '');
    const titleMatch = stripped.match(/^#\s+(.+)/m);
    const title      = titleMatch ? titleMatch[1] : (item ? item.slug : '');
    document.title   = `${title} · Malayan Tapir`;

    const titleEl = document.getElementById('article-title');
    const metaEl  = document.getElementById('article-meta');

    if (titleEl) titleEl.textContent = title;

    if (metaEl && item) {
      const lang = typeof I18n !== 'undefined' ? I18n.getLang() : 'zh';
      const parts = [];
      if (item.date) parts.push(`<span>${item.date}</span>`);
      if (item.tags && item.tags.length) {
        parts.push(item.tags.map(t => `<span class="tag">${t}</span>`).join(''));
      }
      metaEl.innerHTML = parts.join('&ensp;·&ensp;');
    }

    const bodyEl = document.getElementById('article-body');
    if (bodyEl) {
      bodyEl.innerHTML  = Markdown.parse(md);
      bodyEl.className  = `article-body ${proseClass}`;
    }

    const loadingEl = document.getElementById('article-loading');
    if (loadingEl) loadingEl.style.display = 'none';

    const contentEl = document.getElementById('article-content');
    if (contentEl) contentEl.style.display = '';
  }

  function showError(msg) {
    const el = document.getElementById('article-loading');
    if (el) el.textContent = msg;
  }

  // Re-load on language change (picks up .en.md if available)
  window.onLangChange = function () {
    const loadingEl = document.getElementById('article-loading');
    if (loadingEl) loadingEl.style.display = '';
    const contentEl = document.getElementById('article-content');
    if (contentEl) contentEl.style.display = 'none';
    load();
  };

  document.addEventListener('DOMContentLoaded', load);

})();
