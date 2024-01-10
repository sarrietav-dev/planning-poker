import { Injectable } from '@angular/core';
import { Socket as NgxSocket, Socket } from 'ngx-socket-io';
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
import { from, tap } from 'rxjs';
import { State, selectMatchSpectators } from 'src/app/store';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(
    private io: Socket,
    private router: Router,
    private store: Store<{ match: State }>,
  ) {
    this.registerEvents();
  }

  registerEvents() {
    this.playerJoined$().subscribe();

    this.playerLeft$().subscribe();

    this.playerSelectedCard$().subscribe();

    this.adminAssigned$().subscribe();

    this.cardsChanged$().subscribe();

    this.cardsRevealed$().subscribe();

    this.matchRestarted$().subscribe();
  }

  playerJoined$() {
    type Payload = Parameters<events.ClientToServerEvents["player-joined"]>[0]

    return this.io
      .fromEvent<Payload>(events.PlayerJoined)
      .pipe(
        tap(({ id, name }) => {
          this.store.dispatch(playerJoined({ name, id }));
        }),
      );
  }

  playerLeft$() {
    type Payload = Parameters<events.ClientToServerEvents["player-left"]>[0]

    return this.io.fromEvent<Payload>(events.PlayerLeft).pipe(
      tap(({ playerId }) => {
        this.store.dispatch(playerLeft({ playerId }));
      }),
    );
  }

  playerSelectedCard$() {
    type Payload = Parameters<events.ClientToServerEvents["player-selected-card"]>[0]

    return this.io
      .fromEvent<Payload>(events.PlayerSelectedCard)
      .pipe(
        tap(({ playerId, card }) => {
          this.store.dispatch(
            setPlayerCard({
              playerId,
              card,
            }),
          );
        }),
      );
  }

  matchRestarted$() {
    return this.io.fromEvent(events.MatchRestarted).pipe(
      tap(() => {
        this.store.dispatch(resetGame());
      }),
    );
  }

  cardsRevealed$() {
    return this.io.fromEvent(events.CardsRevealed).pipe(
      tap(() => {
        this.store.dispatch(revealCards());
      }),
    );
  }

  adminAssigned$() {
    type Payload = Parameters<events.ClientToServerEvents["admin-assigned"]>[0]

    return this.io.fromEvent<Payload>(events.AdminAssigned).pipe(
      tap(() => {
        this.store.dispatch(toggleIsAdmin({ isAdmin: true }));
      }),
    );
  }

  cardsChanged$() {
    type Payload = Parameters<events.ClientToServerEvents["cards-changed"]>[0]

    return this.io.fromEvent<Payload>(events.CardsChanged).pipe(
      tap((props) => {
        this.store.dispatch(changeCards({ cards: props.cards }));
      }),
    );
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
  }

  async doesMatchExist(matchId: string) {
    return new Promise<boolean>((resolve) => {
      this.io.emit(events.DoesMatchExist, matchId, (exists: boolean) => {
        resolve(exists);
      });
    });
  }

  resetGame() {
    this.store.dispatch(resetGame());
  }

  revealCards() {
    this.store.dispatch(revealCards());
  }

  getSpectators() {
    return this.store.select(selectMatchSpectators);
  }

  getMatch() {
    return this.store.select((state) => state.match.match);
  }

  getAreCardsRevealed() {
    return this.store.select((state) => state.match.areCardsRevealed);
  }
}
