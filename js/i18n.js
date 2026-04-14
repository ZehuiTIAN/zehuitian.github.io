const STRINGS = {
  zh: {
    // Nav
    'nav.writing':  '文字',
    'nav.journal':  '日记',
    'nav.music':    '音乐',
    'nav.tools':    '工具',
    'nav.toggle':   'EN',
    // legacy keys kept for backward compat
    'nav.essays':   '随笔',
    'nav.tech':     '技术文档',
    'nav.games':    '游戏',

    // Header
    'header.bio':     'AIoT语音算法部署 · 手风琴爱好者 · 织码女巫',
    'header.tagline': '只有在两个都不属于ta的世界之间的不毛之地，才有ta的真理和ta的故乡。',

    // Section descriptions
    'section.essays.desc': '文字是思维的出口',
    'section.tech.desc':   '写给未来的自己',
    'section.music.desc':  '手风琴与偶尔的其他',
    'section.games.desc':  '用代码做的玩具',

    // Article page
    'article.back':    '← 返回',
    'article.loading': '正在加载…',
    'article.error':   '加载失败，请检查链接是否正确。',

    // Music page
    'music.title':     '乐谱',
    'music.desc':      '手风琴与偶尔的其他乐器的编曲',
    'music.pdf':       'PDF ↗',
    'music.no-pdf':    '暂无文件',
    'music.score':     '乐谱',
    'music.no-audio':  '浏览器不支持音频',
    'music.load-error':'加载失败',

    // Games page
    'games.title':     '小游戏',
    'games.desc':      '用代码做的玩具，点进去玩',
    'games.play':      '开始游戏 →',

    // Tag filter
    'filter.all':      '全部',

    // Journal
    'journal.loading': '加载中…',
    'journal.error':   '加载失败',

    // Empty states
    'empty.soon':      '内容整理中，敬请期待',

    // Footer
    'footer.copy':     '© 2025 Malayan Tapir',
    'footer.github':   'GitHub',
  },

  en: {
    'nav.writing':  'Writing',
    'nav.journal':  'Journal',
    'nav.music':    'Music',
    'nav.tools':    'Tools',
    'nav.toggle':   '中',
    // legacy keys
    'nav.essays':   'Essays',
    'nav.tech':     'Tech Notes',
    'nav.games':    'Games',

    'header.bio':     'AIoT voice algorithm engineer · accordion player · tech blogger @CodingWitch',
    'header.tagline': 'Only in the barren lands between two worlds that are not quite theirs, can their truth and theirhomeland be found.',

    'section.essays.desc': 'Writing as thinking',
    'section.tech.desc':   'Notes to a future self',
    'section.music.desc':  'Accordion and occasionally other instruments',
    'section.games.desc':  'Toys made of code',

    'article.back':    '← Back',
    'article.loading': 'Loading…',
    'article.error':   'Failed to load. Please check the URL.',

    'music.title':     'Sheet Music',
    'music.desc':      'Arrangements for accordion and occasionally other instruments',
    'music.pdf':       'PDF ↗',
    'music.no-pdf':    'File not yet available',
    'music.score':     'Score',
    'music.no-audio':  'Audio not supported in this browser',
    'music.load-error':'Failed to load score',

    'games.title':     'Games',
    'games.desc':      'Toys made of code, click to play',
    'games.play':      'Play →',

    'filter.all':      'All',

    'journal.loading': 'Loading…',
    'journal.error':   'Failed to load',

    'empty.soon':      'Content coming soon',

    'footer.copy':     '© 2025 Malayan Tapir',
    'footer.github':   'GitHub',
  }
};

const I18n = (() => {
  let _lang = localStorage.getItem('lang') || 'zh';

  function t(key) {
    return (STRINGS[_lang] && STRINGS[_lang][key]) ??
           (STRINGS['zh'] && STRINGS['zh'][key]) ??
           key;
  }

  function setLang(lang) {
    _lang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    _applyAll();
  }

  function getLang() { return _lang; }

  function _applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    // Call page-specific re-render if defined
    if (typeof onLangChange === 'function') onLangChange();
  }

  // Auto-apply on DOM ready
  function init() {
    document.documentElement.lang = _lang === 'zh' ? 'zh-CN' : 'en';
    _applyAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { t, setLang, getLang };
})();
