import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JoinMatchCommand, CreateMatchCommand } from '@planning-poker/events';
import { Router } from '@angular/router';
import { Match } from '@planning-poker/models';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private io: Socket, private router: Router) {}

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

    function handleJoinMatch(match: Match, error: { message: string }) {
      if (error) {
        return alert(error.message);
      }

      console.log('Match joined', match);
    }

    this.io.emit(JoinMatchCommand, data, handleJoinMatch);
  }
}
