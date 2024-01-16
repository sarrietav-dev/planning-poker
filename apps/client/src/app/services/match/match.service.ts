import { Injectable } from '@angular/core';
import * as events from '@planning-poker/events';
import { ActivatedRoute, Router } from '@angular/router';
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
  spectatorJoined,
  spectatorLeft,
} from 'src/app/store/match.actions';
import { tap } from 'rxjs';
import { State } from 'src/app/store';
import { SocketIoClientService } from '../socket.io-client/socket.io-client.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(
    private io: SocketIoClientService,
    private router: Router,
    private store: Store<{ match: State }>,
    private route: ActivatedRoute,
  ) {
    this.registerEvents();
  }

  registerEvents() {
    this.onSession$().subscribe();

    this.playerJoined$().subscribe();

    this.playerLeft$().subscribe();

    this.playerSelectedCard$().subscribe();

    this.adminAssigned$().subscribe();

    this.cardsChanged$().subscribe();

    this.cardsRevealed$().subscribe();

    this.matchRestarted$().subscribe();
  }

  onSession$() {
    return this.io.fromEvent("session").pipe(
      tap(({ sessionId, userId }) => {
        sessionStorage.setItem("sessionId", sessionId);
        sessionStorage.setItem("userId", userId);
      })
    );
  }

  get sessionId() {
    return sessionStorage.getItem("sessionId");
  }

  get userId() {
    return sessionStorage.getItem("userId");
  }

  get matchId() {
    return new URL(window.location.href).pathname.split('/')[2];
  }

  playerJoined$() {
    return this.io
      .fromEvent(events.PlayerJoined)
      .pipe(
        tap(({ id, name, card }) => {
          this.store.dispatch(playerJoined({ name, id, card }));
        }),
      );
  }

  playerLeft$() {
    return this.io.fromEvent(events.PlayerLeft).pipe(
      tap(({ playerId }) => {
        this.store.dispatch(playerLeft({ playerId }));
      }),
    );
  }

  spectatorJoined$() {
    return this.io.fromEvent(events.SpectatorJoined).pipe(
      tap(({ id, name }) => {
        this.store.dispatch(spectatorJoined({ name, id }));
      }),
    );
  }

  spectatorLeft$() {
    return this.io.fromEvent(events.SpectatorLeft).pipe(
      tap(({ spectatorId }) => {
        this.store.dispatch(spectatorLeft({ spectatorId }));
      }),
    );
  }

  playerSelectedCard$() {
    return this.io
      .fromEvent(events.PlayerSelectedCard)
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

    return this.io.fromEvent(events.AdminAssigned).pipe(
      tap(() => {
        this.store.dispatch(toggleIsAdmin({ isAdmin: true }));
      }),
    );
  }

  cardsChanged$() {

    return this.io.fromEvent(events.CardsChanged).pipe(
      tap((props) => {
        this.store.dispatch(changeCards({ cards: props.cards }));
      }),
    );
  }

  cardDeck$() {
    return this.store.select((state) => state.match.match.cardDeck);
  }

  createMatch(name: string) {
    const handleMatchCreated: events.Awk<string> = (matchId, error) => {
      if (error) {
        return alert(error.message);
      }

      this.store.dispatch(toggleIsAdmin({ isAdmin: true }));
      this.router.navigate(['/match', matchId]);
    };

    this.io.emit(events.CreateMatchCommand, name, handleMatchCreated);
  }

  joinMatch(matchId: string, name: string, mode: "spectator" | "player") {
    const handleJoinMatch: events.Awk<Match> = (match, error) => {
      if (error) {
        return alert(error.message);
      }

      if (!match) {
        return alert('Match not found');
      }

      this.store.dispatch(setMatch({ match }));
    };

    this.io.emit(events.JoinMatchCommand, matchId, name, mode, handleJoinMatch);
  }

  selectCard(card: number) {
    this.io.emit(events.ChooseCardCommand, this.matchId, card);
  }

  async doesMatchExist(matchId: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.io.emit(events.DoesMatchExist, matchId, (exists, error) => {
        if (error) {
          return reject(error);
        }

        if (!exists) {
          return resolve(false);
        }

        resolve(exists);
      });
    });
  }

  resetGame() {
    this.io.emit(events.ResetGameCommand, this.matchId)
    this.store.dispatch(resetGame());
  }

  revealCards() {
    this.io.emit(events.RevealCardsCommand, this.matchId)
    this.store.dispatch(revealCards());
  }

  getSpectators() {
    return this.store.select((state) => state.match.match.spectators);
  }

  getMatch() {
    return this.store.select((state) => state.match.match);
  }

  getAreCardsRevealed() {
    return this.store.select((state) => state.match.areCardsRevealed);
  }

  getCurrentPlayerId() {
    return sessionStorage.getItem("userId")
  }

  getPlayers() {
    return this.store.select((state) => state.match.match.players);
  }
}
