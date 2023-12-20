import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State, selectIsAdmin, selectPlayers } from '../../store';
import { from, map, reduce, scan, switchMap, take, tap } from 'rxjs';

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
  match$ = this.store.select('match');
  isInviteModalOpen = false;

  get spectators$() {
    return this.matchService.getSpectators().pipe(
      switchMap((spectators) => from(spectators)),
      take(3),
      reduce((acc, spectator) => [...acc, spectator], [] as { name: string }[])
    );
  }

  get spectatorsCount$() {
    return this.matchService.getSpectators().pipe(
      switchMap((spectators) => from(spectators)),
      scan((acc) => acc + 1, 0)
    );
  }

  spectatorsCount = 0;

  ngOnInit(): void {
    this.spectatorsCount$.subscribe((count) => {
      this.spectatorsCount = count;
    });
  }

  get name$() {
    return this.match$.pipe(map((match) => match.match.name));
  }

  get spectatorCountLabel() {
    return `${this.spectatorsCount - 3}+`;
  }

  handleUserChoose(data: { name: string; mode: string }) {
    this.isUserChosed = true;
    this.matchService.joinMatch(
      this.route.snapshot.paramMap.get('id')!,
      data.name,
      data.mode
    );
  }

  handleInviteModalOpen() {
    this.isInviteModalOpen = true;
  }

  handleInviteModalClose() {
    this.isInviteModalOpen = false;
  }
}
