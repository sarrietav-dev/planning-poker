import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-results',
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.scss',
})
export class MatchResultsComponent {
  @Input() average: number = 0;
  @Input() results: { card: number; votes: number }[] = [];
}
