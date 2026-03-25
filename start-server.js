import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8766;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);

  // 处理根路径
  let filePath = req.url === '/' ? '/test-simple.html' : req.url;

  // 构建完整文件路径
  filePath = path.join(FRONTEND_DIR, filePath);

  // 获取文件扩展名
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // 读取并返回文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，返回 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - 文件未找到</h1><p>请访问 <a href="/test-simple.html">/test-simple.html</a> 进行测试</p>');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      }
    } else {
      // 成功返回文件
      res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 召集吧 - 前端测试服务器');
  console.log('='.repeat(50));
  console.log(`✅ 服务器已启动`);
  console.log(`📱 访问地址: http://localhost:${PORT}/test-simple.html`);
  console.log(`📱 完整版测试: http://localhost:${PORT}/index.html`);
  console.log('='.repeat(50));
  console.log('按 Ctrl+C 停止服务器');
});
