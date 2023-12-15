import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchComponent } from './match.component';
import { MatchService } from 'src/app/services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { DeskComponent } from './components/desk/desk.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'joinMatch',
      'createMatch',
      'cardDeck$'
    ]) as jasmine.SpyObj<MatchService>;

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    storeSpy.select.and.callFake(() => EMPTY);
    serviceSpy.cardDeck$.and.callFake(() => EMPTY);

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    TestBed.configureTestingModule({
      declarations: [
        MatchComponent,
        JoinDialogComponent,
        MatchComponent,
        DeskComponent,
        InviteDialogComponent,
        CardDeckComponent,
      ],
      imports: [ButtonComponent, DialogComponent, ReactiveFormsModule],
      providers: [
        { provide: MatchService, useValue: serviceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    });
    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
