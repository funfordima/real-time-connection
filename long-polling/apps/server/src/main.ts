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

app.get('/api/get-messages', (req, res) => {
  emitter.once('newMessage', (message) => {
    res.json(message);
  });
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
