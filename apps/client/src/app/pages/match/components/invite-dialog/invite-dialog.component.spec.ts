import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteDialogComponent } from './invite-dialog.component';
import { CommonModule, Location as NgLocation } from '@angular/common';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';

describe('InviteDialogComponent', () => {
  let component: InviteDialogComponent;
  let fixture: ComponentFixture<InviteDialogComponent>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('NgLocation', [
      'prepareExternalUrl',
      'path',
    ]);

    serviceSpy.prepareExternalUrl.and.returnValue('/test');
    serviceSpy.path.and.returnValue('/test');

    await TestBed.configureTestingModule({
      imports: [CommonModule, ButtonComponent, DialogComponent, MatIconModule],
      declarations: [InviteDialogComponent],
      providers: [
        {
          provide: NgLocation,
          useValue: serviceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct invite link', () => {
    const expectedUrl = `${window.location.protocol}//${
      window.location.hostname
    }${window.location.port ? ':' + window.location.port : ''}/test`;
    expect(component.inviteLink).toBe(expectedUrl);
  });

  it('should copy invite link to clipboard', () => {
    spyOn(navigator.clipboard, 'writeText');
    component.copyLink();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      component.inviteLink
    );
  });

  it('should emit close event when closeDialog is called', () => {
    spyOn(component.close, 'emit');
    component.closeDialog();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
