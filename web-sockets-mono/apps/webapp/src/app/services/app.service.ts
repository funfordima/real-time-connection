import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { ChatMessage, ChatRelayMessage, SystemNoticeMessage, User, WsMessage } from '@web-sockets-mono/types';

@Injectable()
export class AppService {
  socket?: WebSocketSubject<WsMessage>;
  user$ = new BehaviorSubject<User | undefined>({} as User);
  userList$ = new BehaviorSubject<User[]>([]);
  chatMessage$ = new Subject<ChatRelayMessage>();
  systemNoticeMessage$ = new Subject<SystemNoticeMessage>();

  connect(name: string) {
    this.socket = webSocket(`ws://localhost:8080?name=${name}`);
    this.socket.subscribe((message) => this.onMessageFromServer(message));
  }

  send(contents: string): void {
    const payload: ChatMessage = {
      event: 'chat',
      contents,
    };

    this.socket?.next(payload);
  }

  private onMessageFromServer(message: WsMessage): void {
    switch(message.event) {
      case 'login': {
        this.user$.next(message.user);

        break;
      }

      case 'chatRelay': {
        this.chatMessage$.next(message);

        break;
      }

      case 'systemNotice': {
        this.systemNoticeMessage$.next(message);

        break;
      }

      case 'userList': {
        this.userList$.next(message.users);

        break;
      }
    }
  }
}
