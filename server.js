import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ===================== 配置 =====================
const FRONTEND_PORT = 8766;
const API_BACKEND = {
  host: 'localhost',
  port: 3000,
};

const MIME_TYPES = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'application/javascript;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// ===================== 反代 /api/* → 后端 :3000 =====================
function proxyToBackend(req, res) {
  const options = {
    hostname: API_BACKEND.host,
    port: API_BACKEND.port,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${API_BACKEND.host}:${API_BACKEND.port}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      'Access-Control-Allow-Origin': '*',
    });
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.warn('[Proxy] Backend unavailable:', err.message);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 503, message: '后端服务未启动', data: null }));
  });

  req.pipe(proxyReq, { end: true });
}

// ===================== 静态文件服务 =====================
http.createServer((req, res) => {
  const rawPath = req.url.split('?')[0];

  // API 请求 → 反代到后端
  if (rawPath.startsWith('/api/')) {
    return proxyToBackend(req, res);
  }

  // favicon 不报错
  if (rawPath.includes('favicon')) {
    res.writeHead(204);
    res.end();
    return;
  }

  let urlPath = rawPath === '/' ? '/demo.html' : rawPath;
  let fp = path.join(__dirname, urlPath);

  try {
    let c = fs.readFileSync(fp);
    let ext = path.extname(fp);
    let ct = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = { 'Content-Type': ct };

    if (urlPath === '/sw.js') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Service-Worker-Allowed'] = '/';
    }

    if (ext === '.png' || ext === '.svg' || ext === '.ico') {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    res.writeHead(200, headers);
    res.end(c);
  } catch (e) {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(FRONTEND_PORT, () => {
  console.log(`✅ 前端服务已启动: http://localhost:${FRONTEND_PORT}`);
  console.log(`🔌 API 反代: /api/* → http://localhost:${API_BACKEND.port}`);
});
