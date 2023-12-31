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
export class MatchComponent {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private store: Store<{
      match: State;
    }>,
  ) {}

  isUserChosed: boolean = false;
  match$ = this.store.select('match');
  isInviteModalOpen = false;
  selectedCard = -1;

  spectatorsCount = 0;

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
      data.mode,
    );
  }

  handleInviteModalOpen() {
    this.isInviteModalOpen = true;
  }

  handleInviteModalClose() {
    this.isInviteModalOpen = false;
  }

  onSelectedCard(card: number) {
    if (this.selectedCard === -1) {
      this.selectedCard = card;
      this.matchService.selectCard(card);
    }
  }

  get isUserPlayer() {
    return true;
  }

  get isCardDeckModalOpen() {
    return this.selectedCard === -1 && this.isUserChosed && this.isUserPlayer;
  }
}
