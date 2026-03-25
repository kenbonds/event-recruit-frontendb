import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/demo.html' : req.url.split('?')[0];
  let fp = path.join(__dirname, urlPath);
  try {
    if (urlPath.includes('favicon')) { res.writeHead(204); res.end(); return; }
    let c = fs.readFileSync(fp);
    let ext = path.extname(fp);
    let ct = MIME_TYPES[ext] || 'application/octet-stream';
    
    const headers = { 'Content-Type': ct };
    
    // Service Worker needs correct MIME type
    if (urlPath === '/sw.js') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Service-Worker-Allowed'] = '/';
    }
    
    // Cache static assets aggressively
    if (ext === '.png' || ext === '.svg' || ext === '.ico') {
      headers['Cache-Control'] = 'public, max-age=86400';
    }
    
    res.writeHead(200, headers);
    res.end(c);
  } catch (e) {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(8766, () => console.log('Server running on http://localhost:8766'));
