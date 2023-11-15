import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() selected?: boolean;
  @Input() value!: string;
}
