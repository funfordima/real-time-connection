import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer, ServerOptions, RawData } from 'ws';

import { UserManager } from './user-manager';
import { WsMessage } from '@web-sockets-mono/types';

export class WsHandler {
  private wsServer: WebSocketServer;5
  private userManager: UserManager;

  initialize(options: ServerOptions): void {
    this.wsServer = new WebSocketServer(options);
    this.userManager = new UserManager();

    this.wsServer.on('listening', () => console.log(`Server listening on port ${options.port}`));
    this.wsServer.on('connection', (socket, request) => this.onSocketConnected(socket, request));
  }

  private onSocketConnected(socket: WebSocket, request: IncomingMessage): void {
    console.log('New web socket connection!');

    this.userManager.addSocket(socket, request);

    socket.on('message', (data) => this.onSocketMessage(socket, data));
    socket.on('close', (code, reason) => {
      this.onSocketClosed(socket, code, reason);
    });
  }

  private onSocketMessage(socket: WebSocket, data: RawData): void {
    const payload: WsMessage = JSON.parse(`${data}`);

    console.log(`Received data: ${payload}`);

    switch(payload.event) {
      case 'chat': {
        this.userManager.relayChat(socket, payload);

        break;
      }
    }

    this.userManager.sendToAll(payload);
  }

  private onSocketClosed(socket: WebSocket, code: number, reason: Buffer): void {
    console.log(`Client has disconnected. code=${code}; reason=${reason}`);

    this.userManager.removeSocket(socket);
  }
}
