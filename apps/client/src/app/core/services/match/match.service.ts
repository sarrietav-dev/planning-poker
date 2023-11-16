import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
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
  constructor(private io: Socket, private router: Router) {
    this.handleMatchCreated();
  }

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
      console.log('Match created', matchId);
      this.router.navigate(['/match', matchId]);
    });
  }
}
