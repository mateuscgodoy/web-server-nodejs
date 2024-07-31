import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`Method: ${req.method}, ${req.url}`);
  const publicDirPath = path.join(
    __dirname,
    '..',
    'public',
    req.url === '/' ? 'index.html' : req.url!
  );
  const extname = String(path.extname(publicDirPath)).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(publicDirPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(
          path.join(__dirname, '..', 'public', '404.html'),
          (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        );
      } else {
        res.writeHead(500);
        res.end(
          `Sorry, check with the site admin for the error: ${error.code} ..\n`
        );
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
