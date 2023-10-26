import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer, ServerOptions } from 'ws';

export class WsHandler {
  private wsServer: WebSocketServer;

  initialize(options: ServerOptions): void {
    this.wsServer = new WebSocketServer(options);

    this.wsServer.on('listening', () => console.log(`Server listening on port ${options.port}`));
    this.wsServer.on('connection', (socket, request) => this.onSocketConnected(socket, request));
  }

  private onSocketConnected(socket: WebSocket, request: IncomingMessage): void {
    console.log('New web socket connection!');
  }
}
