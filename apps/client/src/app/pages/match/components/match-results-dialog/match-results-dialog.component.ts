import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-results-dialog',
  templateUrl: './match-results-dialog.component.html',
  styleUrl: './match-results-dialog.component.scss',
})
export class MatchResultsDialogComponent {
  @Input() results: { card: number; votes: number }[] = [];

  get average() {
    return this.results.reduce((acc, curr) => {
      return acc + curr.card * curr.votes;
    }, 0);
  }
}
