# Malayan Tapir — 内容编辑指南

## 修改个人介绍文字

编辑 [`js/i18n.js`](js/i18n.js)，找到 `zh` / `en` 两个对象：

```js
'header.bio':     'AIoT语音算法部署 · 手风琴爱好者 · 织码女巫',
'header.tagline': '只有在两个都不属于她的世界之间…',
```

---

## 添加文章 / 技术笔记

**第一步**：在 `content/` 下对应目录创建 Markdown 文件：

| 类型 | 目录 |
|------|------|
| 随笔 | `content/essays/your-slug.md` |
| 技术笔记 | `content/tech-notes/your-slug.md` |
| 其他（如教程） | `content/tutorials/your-slug.md`（新建目录即可） |

**第二步**：在 [`js/content-index.js`](js/content-index.js) 的 `writing` 数组里加一条：

```js
{
  slug:  'your-slug',                          // 与文件名一致（不含 .md）
  title: { zh: '中文标题', en: 'English Title' },
  date:  '2025-08-01',
  desc:  { zh: '一句话简介', en: 'One-line description' },
  dir:   'essays',                             // 对应 content/ 下的目录名
  type:  'essay',                              // 'essay' | 'tech' | 'tutorial'
  tags:  ['随笔'],                             // 自由填写，用于首页标签筛选
},
```

> `type` 只影响文章页字体：`essay` 用衬线（Lora），`tech` 用无衬线（Space Grotesk）。

**Markdown 文件格式**（无需 frontmatter，第一行 `#` 作为标题）：

```markdown
# 文章标题

正文内容……
```

---

## 添加日记

**第一步**：创建 `content/journal/your-slug.md`，内容随意，无需标题行。

**第二步**：在 `content-index.js` 的 `journal` 数组加一条：

```js
{
  slug:  '2025-08-01-some-title',   // 建议以日期开头，与文件名一致
  date:  '2025-08-01',
  title: '随便写个标题',             // 可选，不填则显示日期
  mood:  '☁️',                      // 可选 emoji 或文字
},
```

首页会自动按日期倒序排列，点击展开内容（懒加载）。

---

## 添加乐谱

在 `content-index.js` 的 `music` 数组：

```js
{
  slug:     'piece-name',
  title:    'Piece Title',
  desc:     { zh: '手风琴改编', en: 'Accordion arrangement' },
  composer: 'Composer Name',
  arranger: 'Malayan Tapir',        // 可选
  year:     2025,                   // 可选
  pdf:      'assets/music/file.pdf' // 没有文件就填 null
},
```

PDF 文件放在 `assets/music/` 目录下。

---

## 添加工具 / 游戏

在 `content-index.js` 的 `games` 数组：

```js
{
  slug:  'my-tool',
  title: { zh: '工具名', en: 'Tool Name' },
  desc:  { zh: '一句话介绍', en: 'Description' },
  url:   'games/my-tool/',           // 相对路径或外链
  tech:  ['canvas', 'vanilla JS'],   // 可选标签
},
```

---

## 本地预览

```bash
python3 -m http.server
# 打开 http://localhost:8000
```
