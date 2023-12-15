import { Component, EventEmitter, Output } from '@angular/core';
import { Location as NgLocation } from '@angular/common';

@Component({
  selector: 'match-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrl: './invite-dialog.component.scss',
})
export class InviteDialogComponent {
  constructor(private location: NgLocation) {}

  @Output() close = new EventEmitter<void>();

  get inviteLink(): string {
    return this.url;
  }

  copyLink() {
    navigator.clipboard.writeText(this.inviteLink);
  }

  closeDialog() {
    this.close.emit();
  }

  private get url() {
    const fullUrl = this.location.prepareExternalUrl(this.location.path());
    const urlObject = window.location;
    return `${urlObject.protocol}//${urlObject.hostname}${
      urlObject.port ? ':' + urlObject.port : ''
    }${fullUrl}`;
  }
}
