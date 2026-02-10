const fs = require('fs');
const { marked } = require('marked');

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function(code, lang) {
    return code;
  }
});

function renderMarkdown(file) {
  const content = fs.readFileSync(file, 'utf8');
  
  // 移除 front matter
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  
  const frontMatter = match[1];
  const markdown = match[2];
  
  // 解析 front matter
  const title = frontMatter.match(/title:\s*(.+)/i)?.[1]?.trim() || 'Untitled';
  const date = frontMatter.match(/date:\s*(.+)/i)?.[1]?.trim() || '';
  
  // 渲染 markdown
  const html = marked.parse(markdown);
  
  return { title, date, html };
}

module.exports = { renderMarkdown };
