import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

import { ChatMessage, ChatRelayMessage, LoginMessage, SystemNoticeMessage, User, UserListMessage, WsMessage } from '@web-sockets-mono/types';

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

    const loginMessage: LoginMessage = {
      event: 'login',
      user,
    };

    socket.send(JSON.stringify(loginMessage));

    this.sockets.set(socket, user);
    this.sendUserListToAll();
  }

  removeSocket(socket: WebSocket): void {
    const name = this.sockets.get(socket).name;

    const systemNoticeMessage: SystemNoticeMessage = {
      event: 'systemNotice',
      contents: `${name} has left the chat`,
    };

    this.sendToAll(systemNoticeMessage);

    this.sockets.delete(socket);
    this.sendUserListToAll();
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

  relayChat(socketFrom: WebSocket, chatMessage: ChatMessage): void {
    const relayMessage: ChatRelayMessage = {
      event: 'chatRelay',
      contents: chatMessage.contents,
      author: this.sockets.get(socketFrom),
    };

    this.sendToAll(relayMessage);
  }

  sendUserListToAll(): void {
    const userListMessage: UserListMessage = {
      event: 'userList',
      users: [...this.sockets.values()],
    };

    this.sendToAll(userListMessage);
  }
}
