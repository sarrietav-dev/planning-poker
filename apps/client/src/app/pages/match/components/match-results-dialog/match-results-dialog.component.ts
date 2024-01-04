import { Component, Input } from '@angular/core';
import { AverageService } from '../../services/average.service';

@Component({
  selector: 'match-results-dialog',
  templateUrl: './match-results-dialog.component.html',
  styleUrl: './match-results-dialog.component.scss',
})
export class MatchResultsDialogComponent {
  constructor(private averageService: AverageService) {}

  @Input() results: { card: number; votes: number }[] = [];

  get average() {
    return this.averageService.calculateAverage(this.results);
  }
}
