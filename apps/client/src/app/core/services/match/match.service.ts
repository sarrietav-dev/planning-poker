import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {
  JoinMatchCommand,
  CreateMatchCommand,
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
    const handleMatchCreated = ({ matchId }: { matchId: string }) => {
      console.log('Match created', matchId);
      this.router.navigate(['/match', matchId]);
    };

    this.io.emit(CreateMatchCommand, name, handleMatchCreated);
  }

  joinMatch(matchId: string, name: string, mode: string) {
    const data = {
      matchId,
      name,
      mode,
    };

    function handleJoinMatch(_: string, error: { message: string }) {
      if (error) {
        alert(error.message);
      }
    }

    this.io.emit(JoinMatchCommand, data, handleJoinMatch);
  }

  handleMatchCreated() {
    this.io.on(MatchCreated, (matchId: string) => {});
  }
}
