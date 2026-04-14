// Lightweight Markdown parser.
// Supports: headings, bold, italic, code blocks, inline code,
// links, blockquotes, unordered/ordered lists, horizontal rules, tables, paragraphs.

const Markdown = (() => {

  function parse(md) {
    // Strip HTML comment frontmatter (<!-- ... -->)
    md = md.replace(/^<!--[\s\S]*?-->\n?/, '');

    const lines = md.split('\n');
    const tokens = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      if (/^```/.test(line)) {
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        tokens.push({ type: 'code', lang, text: codeLines.join('\n') });
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        tokens.push({ type: 'hr' });
        i++;
        continue;
      }

      // Heading
      const hMatch = line.match(/^(#{1,4})\s+(.+)/);
      if (hMatch) {
        tokens.push({ type: 'heading', level: hMatch[1].length, text: hMatch[2] });
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(line)) {
        const quoteLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        tokens.push({ type: 'blockquote', text: quoteLines.join('\n') });
        continue;
      }

      // Table (line with | characters)
      if (/^\|.+\|/.test(line) && i + 1 < lines.length && /^\|[-| :]+\|/.test(lines[i + 1])) {
        const tableLines = [];
        while (i < lines.length && /^\|/.test(lines[i])) {
          tableLines.push(lines[i]);
          i++;
        }
        tokens.push({ type: 'table', lines: tableLines });
        continue;
      }

      // Unordered list
      if (/^[\*\-\+]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^[\*\-\+]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[\*\-\+]\s+/, ''));
          i++;
        }
        tokens.push({ type: 'ul', items });
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ''));
          i++;
        }
        tokens.push({ type: 'ol', items });
        continue;
      }

      // Empty line — paragraph break
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph: collect consecutive non-special lines
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^(#{1,4}\s|>\s?|```|[\*\-\+]\s|\d+\.\s|-{3,}|\*{3,}|_{3,}|\|)/.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        tokens.push({ type: 'paragraph', text: paraLines.join(' ') });
      }
    }

    return tokensToHtml(tokens);
  }

  function tokensToHtml(tokens) {
    return tokens.map(tok => {
      switch (tok.type) {
        case 'heading':
          return `<h${tok.level}>${inline(tok.text)}</h${tok.level}>`;

        case 'paragraph':
          return `<p>${inline(tok.text)}</p>`;

        case 'blockquote':
          return `<blockquote>${parse(tok.text)}</blockquote>`;

        case 'code':
          return `<pre><code class="language-${tok.lang || 'text'}">${escapeHtml(tok.text)}</code></pre>`;

        case 'hr':
          return `<hr>`;

        case 'ul':
          return `<ul>${tok.items.map(it => `<li>${inline(it)}</li>`).join('')}</ul>`;

        case 'ol':
          return `<ol>${tok.items.map(it => `<li>${inline(it)}</li>`).join('')}</ol>`;

        case 'table':
          return renderTable(tok.lines);

        default:
          return '';
      }
    }).join('\n');
  }

  function inline(text) {
    return text
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`)
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function renderTable(lines) {
    const rows = lines.map(l =>
      l.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1)
    );
    const header = rows[0];
    // rows[1] is the separator row — skip it
    const body   = rows.slice(2);

    const headerHtml = `<tr>${header.map(c => `<th>${inline(c)}</th>`).join('')}</tr>`;
    const bodyHtml   = body.map(row =>
      `<tr>${row.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`
    ).join('');

    return `<table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return { parse };
})();
