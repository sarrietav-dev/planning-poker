import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchService } from 'src/app/services/match/match.service';
import { toArray } from 'rxjs';

@Component({
  selector: 'match-card-deck-modal',
  templateUrl: './card-deck-modal.component.html',
  styleUrl: './card-deck-modal.component.scss',
})
export class CardDeckModalComponent {
  constructor(private service: MatchService) { }

  @Input() selectedCard: number | null = null;
  @Output() cardSelect = new EventEmitter<number>();

  cards: number[] = [];

  ngOnInit() {
    this.service
      .cardDeck$()
      .pipe(toArray())
      .subscribe((cards) => {
        this.cards = cards;
      });
  }

  selectCard(card: number) {
    if (this.selectedCard === null) {
      this.selectedCard = card;
      setTimeout(() => {
        this.cardSelect.emit(card);
      }, 1000);
    }
  }

  cardValue(card: number) {
    return card.toString();
  }
}
