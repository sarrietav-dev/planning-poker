import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './button.component.scss',
  template: `
    <button
      [ngClass]="className"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() variant?: 'outlined';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output('click') onClick = new EventEmitter();

  get className() {
    return `btn btn--${this.color} ${
      this.variant ? `btn--${this.variant}` : ''
    }`;
  }

  handleClick() {
    this.onClick.emit();
  }
}
