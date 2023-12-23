import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as events from '@planning-poker/events';
import { Router } from '@angular/router';
import { Match } from '@planning-poker/models';
import { Store } from '@ngrx/store';
import {
  changeCards,
  playerJoined,
  playerLeft,
  setMatch,
  setPlayerCard,
  toggleIsAdmin,
  resetGame,
  revealCards,
} from 'src/app/store/match.actions';
import { from } from 'rxjs';
import { State, selectAreCardsRevealed } from 'src/app/store';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(
    private io: Socket,
    private router: Router,
    private store: Store<State>
  ) {
    this.registerEvents();
  }

  match$ = this.store.select('match');

  registerEvents() {
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

    this.adminAssigned$.subscribe(() => {
      this.store.dispatch(toggleIsAdmin({ isAdmin: true }));
    });

    this.cardsChanged$.subscribe(({ cards }) => {
      this.store.dispatch(changeCards({ cards }));
    });

    this.cardsRevealed$.subscribe(() => {
      this.store.dispatch(revealCards());
    });

    this.matchRestarted$.subscribe(() => {
      this.store.dispatch(resetGame());
    });
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

  get matchRestarted$() {
    return this.io.fromEvent(events.MatchRestarted);
  }

  get cardsRevealed$() {
    return this.io.fromEvent(events.CardsRevealed);
  }

  get adminAssigned$() {
    return this.io.fromEvent<{ playerId: string }>(events.AdminAssigned);
  }

  get cardsChanged$() {
    return this.io.fromEvent<{ cards: number[] }>(events.CardsChanged);
  }

  cardDeck$() {
    return from([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
  }

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

  selectCard(card: number) {
    this.io.emit(events.ChooseCardCommand, card);
    // TODO: FInd a way to know which player is the current one
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

  getSpectators() {
    return this.store.select((state) => state.match.spectators);
  }

  getMatch() {
    return this.store.select((state) => state.match);
  }

  getAreCardsRevealed() {
    return this.store.select((state) => state.areCardsRevealed);
  }
}
