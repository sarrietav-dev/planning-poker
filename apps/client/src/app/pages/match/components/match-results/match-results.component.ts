import { Component, Input } from '@angular/core';
import { AverageService } from '../../services/average.service';

@Component({
  selector: 'match-results',
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.scss',
})
export class MatchResultsComponent {
  constructor(private averageService: AverageService) {}

  @Input() results: { card: number; votes: number }[] = [];

  get average() {
    return this.averageService.calculateAverage(this.results);
  }
}
