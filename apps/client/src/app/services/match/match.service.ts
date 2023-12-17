import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as events from '@planning-poker/events';
import { Router } from '@angular/router';
import { Match } from '@planning-poker/models';
import { Store } from '@ngrx/store';
import {
  playerJoined,
  playerLeft,
  setMatch,
  setPlayerCard,
  toggleIsAdmin,
} from 'src/app/store/match.actions';
import { EMPTY, from } from 'rxjs';
import { resetGame, revealCards } from 'src/app/store/match.actions';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(
    private io: Socket,
    private router: Router,
    private store: Store<{ match: Match; isAdmin: boolean }>
  ) {
    this.playerJoined$.subscribe(({ name, id }) => {
      this.store.dispatch(playerJoined({ name, id }));
    });

    this.playerLeft$.subscribe(({ playerId }) => {
      this.store.dispatch(playerLeft({ playerId }));
    });

    this.playerSelectedCard$.subscribe(({ playerId, card }) => {
      this.store.dispatch(
        setPlayerCard({
          playerId,
          card,
        })
      );
    });
  }

  match$ = this.store.select('match');

  createMatch(name: string) {
    const handleMatchCreated = ({ matchId }: { matchId: string }) => {
      this.store.dispatch(toggleIsAdmin({ isAdmin: true }));
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

  get playerSelectedCard$() {
    return this.io.fromEvent<{ playerId: string; card: number }>(
      events.PlayerSelectedCard
    );
  }

  cardDeck$() {
    return from([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
  }

  selectCard(card: number) {
    console.log(card);
  }

  doesMatchExist(matchId: string, cb: (exists: boolean) => void) {
    this.io.emit(events.DoesMatchExist, matchId, cb);
  }

  resetGame() {
    this.store.dispatch(resetGame());
  }

  revealCards() {
    this.store.dispatch(revealCards());
  }
}
