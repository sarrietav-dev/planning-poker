import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchService } from 'src/app/services/match/match.service';
import { reduce } from 'rxjs';

@Component({
  selector: 'match-card-deck',
  templateUrl: './card-deck.component.html',
  styleUrl: './card-deck.component.scss',
})
export class CardDeckComponent {
  constructor(private service: MatchService) {}

  @Output() cardSelect = new EventEmitter<number>();

  @Input() selectedCard = -1;

  get cardDeck$() {
    return this.service.cardDeck$().pipe(
      reduce((acc, curr) => {
        return [...acc, curr];
      }, [] as number[])
    );
  }

  onSelectedCard(card: number) {
    if (this.selectedCard === -1) {
      this.cardSelect.emit(card);
    }
  }
}
