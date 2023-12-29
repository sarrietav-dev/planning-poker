import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    <div class="dialog-container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {}
