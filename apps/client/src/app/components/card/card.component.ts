import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [CommonModule],
})
export class CardComponent {
  @Input() selected?: boolean;
  @Input() value: string = '';
  @Output() select = new EventEmitter();

  onSelectedCard() {
    this.select.emit();
  }
}
