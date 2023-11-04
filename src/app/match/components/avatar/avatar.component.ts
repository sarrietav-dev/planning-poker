import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() public name!: string;

  get namePrefix(): string {
    return this.name.substring(0, 2);
  }
}
