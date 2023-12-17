import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatchService } from 'src/app/services/match/match.service';
import {
  State,
  selectAreCardsRevealed,
  selectIsAdmin,
  selectPlayers,
} from 'src/app/store';

@Component({
  selector: 'match-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss'],
})
export class DeskComponent {
  constructor(
    private store: Store<{
      match: State;
    }>,
    private service: MatchService
  ) {}

  players$ = this.store.select(selectPlayers);
  currentUserIndex: number = 6;
  isAdmin$ = this.store.select(selectIsAdmin);
  areCardsRevealed$ = this.store.select(selectAreCardsRevealed);

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }

  onRevealCardsClick() {
    this.service.revealCards();
  }

  onResetGameClick() {
    this.service.resetGame();
  }

  didPlayerSelectCard(player: {
    name: string;
    card?: number | undefined;
    id: string;
  }) {
    return player.id !== undefined;
  }

  getCardValue(card: number | undefined) {
    return card === undefined ? '' : card.toString();
  }
}
