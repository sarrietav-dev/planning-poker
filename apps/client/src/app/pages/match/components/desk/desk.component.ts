import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import { map, tap } from 'rxjs';
import { MatchService } from 'src/app/services/match/match.service';
import { State, selectIsAdmin, selectPlayers } from 'src/app/store';

@Component({
  selector: 'match-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
  constructor(
    private store: Store<{
      match: State;
    }>,
    private service: MatchService
  ) { }

  areCardsRevealed?: boolean = false;

  ngOnInit(): void {
    this.service.getPlayers().subscribe((players) => {
      this.players = players
    })

    this.service.getAreCardsRevealed().subscribe((areCardsRevealed) => {
      this.areCardsRevealed = areCardsRevealed;
    });
  }

  players: Match['players'] = []

  currentUserId = this.service.getCurrentPlayerId();
  isAdmin$ = this.store.select(selectIsAdmin);

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }

  onRevealCardsClick() {
    this.service.revealCards();
  }

  onResetGameClick() {
    this.service.resetGame();
  }

  didPlayerSelectCard(player: Match['players'][0]) {
    return player.card !== -1 && player.card !== null;
  }

  getCardValue(card: number | undefined | null) {
    if (card) {
      return card.toString();
    }
    return '';
  }

  get canShowResetGameButton() {
    return this.isAdmin$.pipe(
      map((isAdmin) => isAdmin && this.areCardsRevealed)
    );
  }

  get canShowRevealCardsButton() {
    return this.isAdmin$.pipe(
      map((isAdmin) => isAdmin && !this.areCardsRevealed)
    );
  }
}
