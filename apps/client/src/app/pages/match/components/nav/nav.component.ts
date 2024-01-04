import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { MatchService } from 'src/app/services/match/match.service';
import { State } from 'src/app/store';

@Component({
  selector: 'match-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  constructor(
    private store: Store<{
      match: State;
    }>,
    private matchService: MatchService,
  ) {}

  ngOnInit(): void {
    this.getSpectators$().subscribe((spectators) => {
      this.spectators$ = spectators;
    });

    this.getSpectatorCount$().subscribe((spectatorCount) => {
      this.spectatorsCount = spectatorCount;
    });
  }

  match$ = this.store.select('match');
  spectators$: State['match']['spectators'] = [];
  spectatorsCount = 0;
  @Input() isInviteModalOpen = false;
  @Output() isInviteModalOpenChange = new EventEmitter<boolean>();

  get name$() {
    return this.match$.pipe(map((match) => match.match.name));
  }

  getSpectators$() {
    return this.matchService
      .getSpectators()
      .pipe(map((spectators) => spectators.slice(0, 3)));
  }

  getSpectatorCount$() {
    return this.matchService.getSpectators().pipe(
      map((spectators) => {
        this.spectatorsCount = spectators.length;
        return spectators.length;
      }),
    );
  }

  get spectatorCountLabel() {
    return `${this.spectatorsCount - 3}+`;
  }

  handleInviteModalOpen() {
    this.isInviteModalOpenChange.emit(true);
  }
}
