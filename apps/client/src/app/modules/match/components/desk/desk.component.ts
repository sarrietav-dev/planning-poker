import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
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
    }>
  ) {}

  players$ = this.store.select(selectPlayers);
  currentUserIndex: number = 6;
  isAdmin$ = this.store.select(selectIsAdmin);

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }
}
