// reference: https://www.steveruiz.me/posts/nextjs-refresh-content
import fs from 'fs';
import path from 'path';

import { WebSocketServer } from 'ws';

const mdxDir = path.join('src', 'mdx');
const clients = new Set();

fs.watch(mdxDir, { persistent: true, recursive: true }, async () => {
  clients.forEach((ws) => ws.send('refresh'));
});

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
  clients.add(ws);
  ws.on('error', console.error);
  ws.on('close', () => clients.delete(ws));
});
