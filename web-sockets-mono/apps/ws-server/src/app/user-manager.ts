import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

import { SystemNoticeMessage, User, WsMessage } from '@web-sockets-mono/types';

let currentId = 1;

export class UserManager {
  private sockets = new Map<WebSocket, User>();

  addSocket(socket: WebSocket, request: IncomingMessage): void {
    const fullUrl = new URL(request.headers.host + request.url);
    const userName = fullUrl.searchParams.get('name');
    const user: User = {
      name: userName,
      id: currentId++,
    };
    const systemNoticeMessage: SystemNoticeMessage = {
      event: 'systemNotice',
      contents: `${userName} has joined the chat`,
    };

    this.sendToAll(systemNoticeMessage);

    this.sockets.set(socket, user);
  }

  removeSocket(socket: WebSocket): void {
    this.sockets.delete(socket);
  }

  sendToSocket(socket: WebSocket, message: WsMessage): void {
    const data = JSON.stringify(message);

    socket.send(data);
  }

  sendToAll(message: WsMessage): void {
    [...this.sockets.keys()].forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        this.sendToSocket(socket, message);
      }
    });
  }
}
