import { User } from "./user.interface";

export type WsMessage = ChatMessage | ChatRelayMessage | SystemNoticeMessage | LoginMessage | UserListMessage;

export interface ChatMessage {
  event: 'chat';
  contents: string;
}

export interface ChatRelayMessage {
  event: 'chatRelay';
  contents: string;
  author: User;
}

export interface SystemNoticeMessage {
  event: 'systemNotice';
  contents: string;
}

export interface LoginMessage {
  event: 'login';
  user: User;
}

export interface UserListMessage {
  event: 'userList';
  users: User[];
}
