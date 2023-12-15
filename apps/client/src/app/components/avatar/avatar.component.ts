import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() public name: string = '';
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
  @Input() public showLabel: boolean = true;
  @Input() public backgroundColor: 'default' | 'white' = 'default';
  @Input() public customPrefix?: string;

  get namePrefix(): string {
    return this.customPrefix ?? this.name.substring(0, 2);
  }

  get bgColor(): string {
    return this.backgroundColor === 'default' ? 'var(--somewhat-blue)' : '#fff';
  }
}
