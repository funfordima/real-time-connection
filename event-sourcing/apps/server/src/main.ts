import express from 'express';
import cors from 'cors';
import * as path from 'path';
import events from 'events';

const app = express();
const emitter = new events.EventEmitter();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/connect', (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-type': 'text/event-stream',
    'Cache-control': 'no-cache',
  });

  emitter.on('newMessage', (message) => res.write(`data: ${JSON.stringify(message)} \n\n`));
});

app.post('/api/new-messages', (req, res) => {
  const message = req.body;

  emitter.emit('newMessage', message);

  res.status(200);
});

const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
});

server.on('error', console.error);
