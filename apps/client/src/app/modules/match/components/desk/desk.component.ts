import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatchService } from 'src/app/services/match/match.service';
import { State, selectIsAdmin, selectPlayers } from 'src/app/store';

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

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }

  onRevealCardsClick() {
    this.service.revealCards();
  }

  onResetGameClick() {
    this.service.resetGame();
  }
}
