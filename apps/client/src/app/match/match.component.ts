import { Component } from '@angular/core';
import { MatchService } from '../core/services/match/match.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import { selectPlayers } from '../store';
import { map } from 'rxjs';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private store: Store<{ match: Match }>
  ) {}

  isUserChosed: boolean = false;
  currentUserIndex: number = 6;
  match$ = this.store.select('match');

  players$ = this.store.select(selectPlayers);

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
