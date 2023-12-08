import { Component, OnInit } from '@angular/core';
import { MatchService } from '../core/services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State, selectIsAdmin, selectPlayers } from '../store';
import { map, scan, take, tap } from 'rxjs';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private store: Store<{
      match: State;
    }>
  ) {}

  isUserChosed: boolean = false;
  currentUserIndex: number = 6;
  match$ = this.store.select('match');
  isAdmin$ = this.store.select(selectIsAdmin);

  players$ = this.store.select(selectPlayers);

  spectators$ = this.store
    .select((state) => state.match.match.spectators)
    .pipe(take(3));

  spectatorsCount = 0;

  ngOnInit(): void {
    this.store
      .select((state) => state.match.match.spectators)
      .pipe(scan((acc) => acc + 1, 0))
      .subscribe((count) => {
        this.spectatorsCount = count;
      });
  }

  get name$() {
    return this.match$.pipe(map((match) => match.match.name));
  }

  getSeatClass(index: number) {
    return `seat seat--${index + 1}`;
  }

  get spectatorCountLabel() {
    return `${this.spectatorsCount - 3}+`
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
