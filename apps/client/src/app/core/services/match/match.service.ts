import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import {
  JoinMatchCommand,
  CreateMatchCommand,
  MatchCreated,
} from '@planning-poker/events';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private io: Socket, private router: Router) {}

  createMatch(name: string) {
    this.io.emit(CreateMatchCommand, { name });
  }

  joinMatch(matchId: string) {
    this.io.emit(JoinMatchCommand, {
      matchId,
    });
  }

  handleMatchCreated() {
    this.io.on(MatchCreated, (matchId: string) => {
      this.router.navigate(['/match', matchId]);
    });
  }
}
