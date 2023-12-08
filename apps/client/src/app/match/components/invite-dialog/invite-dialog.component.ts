import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'match-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrl: './invite-dialog.component.scss',
})
export class InviteDialogComponent {
  constructor(private route: ActivatedRoute) {}

  @Output() close = new EventEmitter<void>();

  get inviteLink(): string {
    return this.route.snapshot.toString();
  }

  copyLink() {
    navigator.clipboard.writeText(this.inviteLink);
  }

  closeDialog() {
    this.close.emit();
  }
}
