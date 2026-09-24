// Minimal stand-in for the Upstash Redis REST API: POST / with a JSON command array.
const http = require('http');
const Redis = require('ioredis');
const redis = new Redis({port: 6390});
const TOKEN = 'test-token';
let down = false;
http.createServer((req, res) => {
  if (req.url === '/__down') { down = true; res.end('down'); return; }
  if (req.url === '/__up') { down = false; res.end('up'); return; }
  let body = '';
  req.on('data', c => body += c);
  req.on('end', async () => {
    if (down) { res.writeHead(503); res.end(JSON.stringify({error: 'down'})); return; }
    if (req.headers.authorization !== 'Bearer ' + TOKEN) { res.writeHead(401); res.end(JSON.stringify({error: 'unauthorized'})); return; }
    try {
      const cmd = JSON.parse(body);
      const result = await redis.call(...cmd);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({result}));
    } catch (e) { res.writeHead(400); res.end(JSON.stringify({error: String(e.message)})); }
  });
}).listen(8079, () => console.log('shim on 8079'));
