import { Component } from '@angular/core';
import { MatchService } from '../core/services/match/match.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute
  ) {}

  isUserChosed: boolean = false;
  currentUserIndex: number = 6;
  players = [
    {
      name: 'Player 1',
    },
    {
      name: 'Player 2',
    },
    {
      name: 'Player 3',
    },
    {
      name: 'Player 4',
    },
    {
      name: 'Player 5',
    },
    {
      name: 'Player 6',
    },
    {
      name: 'Player 7',
    },
    {
      name: 'Player 8',
    },
  ];

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
