const fs = require('fs');
const { marked } = require('marked');

marked.setOptions({
  breaks: true,
  gfm: true
});

const postsDir = 'source/_posts';
const publicDir = 'public';

console.log('=== Building AI Tech Hub ===\n');

// THE MACHINE 风格 - POI 终端界面
const indexHead = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE MACHINE | AI Tech Hub</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'VT323', monospace;
            background: #0a0a0a;
            color: #00ff00;
            min-height: 100vh;
            line-height: 1.5;
            font-size: 18px;
            image-rendering: pixelated;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 24px;
        }
        
        header {
            border-bottom: 2px solid #00ff00;
            padding-bottom: 24px;
            margin-bottom: 40px;
        }
        
        h1 {
            font-family: 'VT323', monospace;
            font-size: 2.5rem;
            font-weight: 400;
            letter-spacing: 4px;
            color: #00ff00;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .subtitle {
            color: #008800;
            font-size: 1rem;
            letter-spacing: 2px;
        }
        
        .time {
            color: #008800;
            font-size: 0.9rem;
            margin-top: 12px;
        }
        
        .section-title {
            color: #00ff00;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
            border-left: 3px solid #00ff00;
            padding-left: 12px;
        }
        
        .post {
            padding: 20px 0;
            border-bottom: 1px solid #1a3a1a;
            border-left: 1px solid transparent;
            padding-left: 16px;
            margin-left: -16px;
            transition: all 0.2s;
        }
        
        .post:hover {
            border-left: 3px solid #00ff00;
            background: rgba(0, 255, 0, 0.03);
        }
        
        .post-date {
            color: #006600;
            font-size: 0.8rem;
            margin-bottom: 6px;
        }
        
        .post-title {
            font-size: 1.3rem;
            font-weight: 400;
            color: #00ff00;
            margin-bottom: 8px;
        }
        
        .post-title a {
            color: inherit;
            text-decoration: none;
        }
        
        .post-title a:hover {
            text-decoration: underline;
        }
        
        .post-desc {
            color: #008800;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .cursor {
            display: inline-block;
            width: 10px;
            height: 1.2em;
            background: #00ff00;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
            margin-left: 4px;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #1a3a1a;
            color: #004400;
            font-size: 0.85rem;
        }
        
        a {
            color: #00ff00;
            text-decoration: none;
        }
        
        a:hover {
            background: rgba(0, 255, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>THE MACHINE<span class="cursor"></span></h1>
            <p class="subtitle">// AI TECHNOLOGY HUB</p>
            <p class="time" id="time"></p>
        </header>
        
        <section>
            <p class="section-title">> ACTIVE_DATA_STREAMS</p>
`;

const postTemplate = (title, date, link, desc) => `
            <article class="post">
                <p class="post-date">[${date}]</p>
                <h2 class="post-title"><a href="${link}">${title.replace(/^["']|["']$/g, '')}</a></h2>
                <p class="post-desc">> ${desc}</p>
            </article>
`;

const indexFoot = `
        </section>
        
        <footer>
            <p>> SYSTEM_OPERATIONAL // MONITORING_ACTIVE</p>
            <p>> RUNTIME: ${new Date().toISOString().split('T')[0]}</p>
        </footer>
    </div>
    
    <script>
        function updateTime() {
            document.getElementById('time').textContent = '> TIMESTAMP: ' + new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>
`;

// 文章页面 - THE MACHINE 风格
const articleTemplate = (title, date, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title.replace(/^["']|["']$/g, '')} | THE MACHINE</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'VT323', monospace;
            background: #0a0a0a;
            color: #00ff00;
            min-height: 100vh;
            line-height: 1.6;
            font-size: 18px;
            image-rendering: pixelated;
        }
        
        .container {
            max-width: 720px;
            margin: 0 auto;
            padding: 40px 24px;
        }
        
        .back {
            margin-bottom: 32px;
        }
        
        .back a {
            color: #006600;
            font-size: 0.95rem;
            text-decoration: none;
            padding: 8px 12px;
            border: 1px solid #1a3a1a;
            display: inline-block;
        }
        
        .back a:hover {
            color: #00ff00;
            border-color: #00ff00;
            background: rgba(0, 255, 0, 0.05);
        }
        
        h1 {
            font-family: 'VT323', monospace;
            font-size: 2rem;
            font-weight: 400;
            letter-spacing: 2px;
            color: #00ff00;
            margin-bottom: 12px;
            line-height: 1.3;
        }
        
        .meta {
            color: #006600;
            font-size: 0.85rem;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #1a3a1a;
        }
        
        .content {
            font-size: 1rem;
        }
        
        .content h2 {
            font-size: 1.4rem;
            font-weight: 400;
            color: #00ff00;
            margin: 36px 0 16px;
            letter-spacing: 1px;
            border-left: 3px solid #00ff00;
            padding-left: 12px;
        }
        
        .content h3 {
            font-size: 1.15rem;
            font-weight: 400;
            color: #00cc00;
            margin: 28px 0 12px;
        }
        
        .content p {
            margin-bottom: 16px;
            color: #00cc00;
        }
        
        .content a {
            color: #00ff00;
            text-decoration: none;
            border-bottom: 1px dashed #004400;
        }
        
        .content a:hover {
            background: rgba(0, 255, 0, 0.1);
            border-bottom-style: solid;
        }
        
        .content code {
            background: #0d1a0d;
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 0.9em;
            color: #00ff00;
            border: 1px solid #1a3a1a;
        }
        
        .content pre {
            background: #050a05;
            padding: 20px;
            border-radius: 0;
            overflow-x: auto;
            margin: 24px 0;
            border: 1px solid #1a3a1a;
        }
        
        .content pre code {
            background: none;
            padding: 0;
            border: none;
            color: #00ff00;
        }
        
        .content ul, .content ol {
            padding-left: 24px;
            margin: 16px 0;
        }
        
        .content li {
            margin: 10px 0;
            color: #00cc00;
            list-style-type: square;
        }
        
        .content li::marker {
            color: #006600;
        }
        
        .content blockquote {
            border-left: 3px solid #006600;
            margin: 24px 0;
            padding: 16px 20px;
            background: #050a05;
            color: #008800;
        }
        
        .content hr {
            border: none;
            border-top: 1px solid #1a3a1a;
            margin: 40px 0;
        }
        
        .content img {
            max-width: 100%;
            border: 1px solid #1a3a1a;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="back">
            <a href="/">< RETURN</a>
        </nav>
        
        <article>
            <h1>${title.replace(/^["']|["']$/g, '')}</h1>
            <p class="meta">> TIMESTAMP: ${date} // STATUS: ARCHIVED</p>
            
            <div class="content">
${content}
            </div>
        </article>
    </div>
</body>
</html>`;

// 清理并创建 public 目录
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

// 处理所有文章
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = [];

files.forEach(file => {
    const content = fs.readFileSync(postsDir + '/' + file, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return;
    
    const front = match[1];
    const markdown = match[2];
    
    const title = front.match(/title:\s*(.+)/i)?.[1]?.trim() || 'Untitled';
    const dateMatch = front.match(/date:\s*(.+)/i)?.[1]?.trim() || '';
    const date = dateMatch.split(' ')[0];
    const desc = markdown.split('\n').find(l => l.trim() && !l.startsWith('#'))?.trim() || '';
    
    const html = marked.parse(markdown);
    const basename = file.replace('.md', '');
    const link = '/' + date + '/' + basename + '/';
    
    fs.mkdirSync(publicDir + '/' + date + '/' + basename, { recursive: true });
    fs.writeFileSync(publicDir + '/' + date + '/' + basename + '/index.html', 
        articleTemplate(title, date, html));
    
    posts.push({ title, date, link, desc });
    console.log('✓ ' + date + '/' + basename);
});

// 按日期排序
posts.sort((a, b) => b.date.localeCompare(a.date));

// 生成首页
let indexContent = indexHead;
posts.forEach(post => {
    indexContent += postTemplate(post.title, post.date, post.link, post.desc);
});
indexContent += indexFoot;

fs.writeFileSync(publicDir + '/index.html', indexContent);

console.log('\n✓ Home updated');
console.log('Generated ' + posts.length + ' articles\n');
