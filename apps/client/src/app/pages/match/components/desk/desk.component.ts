import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
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
export class DeskComponent implements OnInit {
  constructor(
    private store: Store<{
      match: State;
    }>,
    private service: MatchService
  ) {}

  areCardsRevealed?: boolean = false;

  ngOnInit(): void {
    this.store.select(selectAreCardsRevealed).subscribe((areCardsRevealed) => {
      this.areCardsRevealed = areCardsRevealed;
    });
  }

  players$ = this.store.select(selectPlayers).pipe(
    tap((players) => {
      console.log({ players });
    })
  );
  currentUserIndex: number = 0;
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

  didPlayerSelectCard(player: {
    name: string;
    card?: number | undefined;
    id: string;
  }) {
    return player.card !== null;
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
