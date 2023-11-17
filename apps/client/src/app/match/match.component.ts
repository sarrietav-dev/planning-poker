import { Component } from '@angular/core';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
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
    return `seat seat--${index + 1}`
  }
}
