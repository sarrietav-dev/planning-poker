import { Component } from '@angular/core';
import { MatchService } from '../core/services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State, selectPlayers } from '../store';
import { map, tap } from 'rxjs';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private store: Store<State>
  ) {}

  isUserChosed: boolean = false;
  currentUserIndex: number = 6;
  match$ = this.store.select('match');

  players$ = this.store.select(selectPlayers)
    .pipe(
      tap(players => console.log(players))
    );

  get name$() {
    return this.match$.pipe(map((match) => match.name));
  }

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }

  handleUserChoose(data: { name: string; mode: string }) {
    this.isUserChosed = true;
    this.matchService.joinMatch(
      this.route.snapshot.paramMap.get('id')!,
      data.name,
      data.mode
    );
  }
}
