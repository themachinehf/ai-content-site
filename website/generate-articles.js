const fs = require('fs');
const { marked } = require('marked');

marked.setOptions({
  breaks: true,
  gfm: true
});

const postsDir = 'source/_posts';
const publicDir = 'public';

const template = (title, date, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title.replace(/^["']|["']$/g, '')}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; margin: 0 auto; padding: 20px; 
            line-height: 1.7; color: #333; background: #fafafa;
        }
        h1 { color: #1a1a1a; border-bottom: 3px solid #0066cc; padding-bottom: 15px; margin-bottom: 25px; }
        h2 { color: #2d2d2d; margin-top: 35px; }
        h3 { color: #404040; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .back { margin-bottom: 25px; }
        .back a { color: #666; font-size: 0.95em; }
        .meta { color: #888; font-size: 0.9em; margin-bottom: 30px; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 0.9em; }
        pre { background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; overflow: auto; }
        pre code { background: none; padding: 0; color: inherit; }
        ul, ol { padding-left: 25px; }
        li { margin: 8px 0; }
        blockquote { 
            border-left: 4px solid #0066cc; 
            margin: 20px 0; padding: 15px 20px; 
            background: #f5f5f5; color: #555;
        }
        img { max-width: 100%; height: auto; border-radius: 8px; }
        hr { border: none; border-top: 1px solid #ddd; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="back"><a href="/">← Back to Home</a></div>
    <h1>${title.replace(/^["']|["']$/g, '')}</h1>
    <p class="meta">${date}</p>
    <div class="content">
${content}
    </div>
</body>
</html>`;

function renderPost(file) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return;
    
    const front = match[1];
    const markdown = match[2];
    
    const title = front.match(/title:\s*(.+)/i)?.[1]?.trim() || 'Untitled';
    const dateMatch = front.match(/date:\s*(.+)/i)?.[1]?.trim() || '';
    const date = dateMatch.split(' ')[0];
    
    const html = marked.parse(markdown);
    
    // 创建目录结构
    const basename = require('path').basename(file, '.md');
    const dir = publicDir + '/' + date + '/' + basename;
    fs.mkdirSync(dir, { recursive: true });
    
    // 写入 HTML
    fs.writeFileSync(dir + '/index.html', template(title, date, html));
    console.log('✓ ' + date + '/' + basename + '/');
}

// 生成所有文章
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
files.forEach(f => renderPost(postsDir + '/' + f));

console.log('\n生成了 ' + files.length + ' 篇文章');
