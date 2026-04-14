// Manual CMS — edit this file to add/update content.
//
// writing entries:
//   dir   → subfolder under content/ where the .md file lives
//   type  → 'essay' | 'tech' | 'tutorial' | 'tool' | 'photo' (affects prose style)
//   tags  → free-form strings shown on the homepage, used for filtering

const CONTENT_INDEX = {

  // ── Writing (essays, tech notes, tutorials, etc.) ─────────────
  writing: [
    {
      slug:  'is-code-purely-rational',
      title: { zh: '代码是纯理性的吗？', en: 'Is Code Purely Rational?' },
      date:  '2025-07-16',
      desc:  { zh: '在TFLM的注释里读到的事', en: 'On a comment in the TFLM source code' },
      lang:  'zh',
      dir:   'essays',
      type:  'essay',
      tags:  ['随笔', '技术与人文'],
    },
    {
      slug:  'tflm-memory-management',
      title: { zh: 'TFLM 内存管理', en: 'TFLM Memory Management' },
      date:  '2024-08-30',
      desc:  { zh: 'Tensor Arena 结构与分配流程', en: 'Tensor Arena layout and allocation flow' },
      lang:  'zh',
      dir:   'tech-notes',
      type:  'tech',
      tags:  ['技术', 'TFLM', 'embedded'],
    },
    // Add new entries like:
    // {
    //   slug:  'obsidian-workflow',
    //   title: { zh: 'Obsidian 工作流', en: 'My Obsidian Workflow' },
    //   date:  '2025-XX-XX',
    //   desc:  { zh: '...', en: '...' },
    //   dir:   'essays',        // or create content/tutorials/
    //   type:  'tutorial',
    //   tags:  ['教程', 'Obsidian', '工具'],
    // },
  ],

  // ── Sheet Music ───────────────────────────────────────────────
  music: [
    {
      slug:     'yellow-submarine',
      title:    'Yellow Submarine',
      desc:     { zh: '手风琴改编，G大调', en: 'Accordion arrangement in G major' },
      composer: 'Lennon / McCartney',
      arranger: 'Malayan Tapir',
      year:     2024,
      pdf:      null,  // set to 'assets/music/yellow-submarine.pdf' when ready
      abc:      'content/music/yellow-submarine.abc',
    },
  ],

  // ── Journal (diary entries) ───────────────────────────────────
  // Each entry is a markdown file at content/journal/<slug>.md
  journal: [
    // {
    //   slug:  '2025-04-10-a-thursday',
    //   date:  '2025-04-10',
    //   title: '一个很平常的周四',   // optional — leave '' to show date only
    //   mood:  '☁️',               // optional emoji or word
    // },
  ],

  // ── Tools & Games ─────────────────────────────────────────────
  games: [
    // {
    //   slug:  'my-game',
    //   title: { zh: '游戏名', en: 'Game Name' },
    //   desc:  { zh: '简介', en: 'Description' },
    //   url:   'games/my-game/',
    //   built: '2025',
    //   type:  'game',   // or 'tool'
    //   tech:  ['canvas', 'vanilla JS'],
    // },
  ],
};
