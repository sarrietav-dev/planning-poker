import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as events from '@planning-poker/events';
import { Router } from '@angular/router';
import { Match } from '@planning-poker/models';
import { Store } from '@ngrx/store';
import { playerJoined, playerLeft, setMatch } from 'src/app/store/match.actions';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(
    private io: Socket,
    private router: Router,
    private store: Store<{ match: Match }>
  ) {
    this.playerJoined$.subscribe(({ name, id }) => {
      this.store.dispatch(playerJoined({ name, id }));
    });

    this.playerLeft$.subscribe(({ playerId }) => {
      this.store.dispatch(playerLeft({ playerId }));
    });
  }

  match$ = this.store.select('match');

  createMatch(name: string) {
    const handleMatchCreated = ({ matchId }: { matchId: string }) => {
      console.log('Match created', matchId);
      this.router.navigate(['/match', matchId]);
    };

    this.io.emit(events.CreateMatchCommand, name, handleMatchCreated);
  }

  joinMatch(matchId: string, name: string, mode: string) {
    const data = {
      matchId,
      name,
      mode,
    };

    const handleJoinMatch = (match: Match, error: { message: string }) => {
      if (error) {
        return alert(error.message);
      }

      this.store.dispatch(setMatch({ match }));
    };

    this.io.emit(events.JoinMatchCommand, data, handleJoinMatch);
  }

  get playerJoined$() {
    return this.io.fromEvent<{ name: string; id: string }>(events.PlayerJoined);
  }

  get playerLeft$() {
    return this.io.fromEvent<{ playerId: string }>(events.PlayerLeft);
  }
}
