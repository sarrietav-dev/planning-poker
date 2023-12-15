import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() variant?: 'outlined';
  @Input() disabled = false;

  get className() {
    return `btn btn--${this.color} ${
      this.variant ? `btn--${this.variant}` : ''
    }`;
  }
}
