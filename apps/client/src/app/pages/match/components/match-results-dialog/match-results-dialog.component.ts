import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-results-dialog',
  templateUrl: './match-results-dialog.component.html',
  styleUrl: './match-results-dialog.component.scss',
})
export class MatchResultsDialogComponent {
  @Input() results: { card: number; votes: number }[] = [];
}
