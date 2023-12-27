import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchService } from 'src/app/services/match/match.service';
import { toArray } from 'rxjs';

@Component({
  selector: 'match-card-deck-modal',
  templateUrl: './card-deck-modal.component.html',
  styleUrl: './card-deck-modal.component.scss',
})
export class CardDeckModalComponent {
  constructor(private service: MatchService) {}

  @Input() choosenCard: number = -1;
  @Output() choosenCardChange = new EventEmitter<number>();

  cards: number[] = [];

  ngOnInit() {
    this.service
      .cardDeck$()
      .pipe(toArray())
      .subscribe((cards) => {
        this.cards = cards;
      });
  }

  chooseCard(card: number) {
    this.choosenCardChange.emit(card);
  }
}
