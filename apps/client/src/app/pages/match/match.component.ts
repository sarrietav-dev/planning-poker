import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { from, map, scan, switchMap } from 'rxjs';

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
  ) {
    this.getSpectators$().subscribe((spectators) => {
      this.spectators$ = spectators;
    });
  }

  isUserChosed: boolean = false;
  match$ = this.store.select('match');
  isInviteModalOpen = false;
  spectators$: State['match']['spectators'] = [];

  getSpectators$() {
    return this.matchService
      .getSpectators()
      .pipe(map((spectators) => spectators.slice(0, 3)));
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
