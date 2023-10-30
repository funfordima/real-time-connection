import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { ChatRelayMessage, SystemNoticeMessage } from '@web-sockets-mono/types';
import { AppService } from './services/app.service';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatListModule],
  providers: [AppService],
  selector: 'web-sockets-mono-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  messageList: ChatRelayMessage[] = [];

  userList$ = this.appService.userList$.asObservable();
  currentUser$ = this.appService.user$.asObservable();

  constructor(
    private readonly appService: AppService,
    private readonly snackBarService: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.appService.chatMessage$.subscribe((message) => this.messageList = [...this.messageList, message]);

    this.appService.systemNoticeMessage$.subscribe((notice) => this.onSystemNotice(notice));
  }

  onConnect(userNameInput: HTMLInputElement): void {
    const userName = userNameInput.value;

    this.appService.connect(userName);
  }

  onSend(chatInput: HTMLInputElement): void {
    this.appService.send(chatInput.value);

    chatInput.value = '';
  }

  onSystemNotice(notice: SystemNoticeMessage): void {
    this.snackBarService.open(notice.contents, undefined, { duration: 5000 });
  }
}
