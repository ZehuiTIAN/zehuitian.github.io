/**
 * 轻量级Markdown解析器
 * 支持：标题、段落、粗体、斜体、链接、列表、代码块
 */

class MarkdownParser {
  constructor() {
    this.rules = [
      { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
      { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
      { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
      { pattern: /^#### (.*$)/gim, replacement: '<h4>$1</h4>' },
      { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' },
      { pattern: /\n\n/g, replacement: '</p><p>' },
      { pattern: /^- (.*$)/gim, replacement: '<li>$1</li>' },
      { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
      { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
      { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' }
    ];
  }

  parse(markdown) {
    let html = markdown;
    
    // 处理代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
    
    // 处理无序列表
    html = html.replace(/(?:^- .*\n?)+/gm, (match) => {
      const items = match.split('\n').filter(line => line.trim());
      return '<ul class="post-list">' + items.map(item => 
        '<li>' + item.replace(/^- /, '').trim() + '</li>'
      ).join('') + '</ul>';
    });
    
    // 处理有序列表
    html = html.replace(/(?:^\d+\. .*\n?)+/gm, (match) => {
      const items = match.split('\n').filter(line => line.trim());
      return '<ol class="post-list numbered">' + items.map(item => 
        '<li>' + item.replace(/^\d+\. /, '').trim() + '</li>'
      ).join('') + '</ol>';
    });
    
    // 应用其他规则（跳过已处理的特殊规则）
    const skipPatterns = [
      /```([\s\S]*?)```/g,
      /(?:^- .*\n?)+/gm,
      /(?:^\d+\. .*\n?)+/gm
    ];
    
    this.rules.forEach(rule => {
      const shouldSkip = skipPatterns.some(pattern => 
        pattern.source === rule.pattern.source && pattern.flags === rule.pattern.flags
      );
      if (!shouldSkip) {
        html = html.replace(rule.pattern, rule.replacement);
      }
    });
    
    // 包装段落
    if (!html.startsWith('<h')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  }
}

// 自动加载Markdown文件
async function loadMarkdownContent() {
  const path = window.location.pathname;
  const mdPath = path.replace('.html', '.md');
  
  try {
    const response = await fetch(mdPath);
    if (response.ok) {
      const markdown = await response.text();
      const parser = new MarkdownParser();
      const html = parser.parse(markdown);
      
      const contentDiv = document.getElementById('markdown-content');
      if (contentDiv) {
        contentDiv.innerHTML = html;
      }
    }
  } catch (error) {
    console.log('Markdown file not found or error loading:', error);
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadMarkdownContent);