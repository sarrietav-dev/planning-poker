import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-results',
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.scss',
})
export class MatchResultsComponent {
  @Input() results: { card: number; votes: number }[] = [];

  get average() {
    return this.results.reduce((acc, curr) => {
      return acc + curr.card * curr.votes;
    }, 0);
  }
}
