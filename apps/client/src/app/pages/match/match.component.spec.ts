import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchComponent } from './match.component';
import { MatchService } from 'src/app/services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { ButtonComponent } from 'src/app/components/atoms/button/button.component';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { DeskComponent } from './components/desk/desk.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { DialogComponent } from 'src/app/components/atoms/dialog/dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarComponent } from 'src/app/components/atoms/avatar/avatar.component';
import { NavComponent } from './components/nav/nav.component';
import { MatchResultsComponent } from './components/match-results/match-results.component';
import { MatchResultsDialogComponent } from './components/match-results-dialog/match-results-dialog.component';
import { Match } from '@planning-poker/models';
import { CardComponent } from 'src/app/components/atoms/card/card.component';
import { FormatVotePipe } from './pipes/format-vote.pipe';

describe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;
  let store: jasmine.SpyObj<Store>;
  let matchService: jasmine.SpyObj<MatchService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'joinMatch',
      'createMatch',
      'cardDeck$',
      'getSpectators',
      'getAreCardsRevealed',
      'getMatch',
      'selectCard',
      'getCurrentPlayerId',
      "getPlayers"
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.getSpectators.and.returnValue(
      of([
        { name: 'hey', id: '' },
        { name: 'whats', id: '' },
        { name: 'up', id: '' },
        { name: 'bro', id: '' },
      ]),
    );

    serviceSpy.getCurrentPlayerId.and.returnValue("");
    serviceSpy.getPlayers.and.returnValue(of([]));

    serviceSpy.getMatch.and.returnValue(
      of({
        cardDeck: [],
        id: '1',
        name: 'hey',
        players: [],
        spectators: [],
      } satisfies Match),
    );

    serviceSpy.getAreCardsRevealed.and.returnValue(of(false));

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    storeSpy.select.and.callFake(() => EMPTY);
    serviceSpy.cardDeck$.and.callFake(() => EMPTY);

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    routeSpy.snapshot = {
      paramMap: {
        get: () => '1',
      },
    };

    TestBed.configureTestingModule({
      declarations: [
        MatchComponent,
        JoinDialogComponent,
        MatchComponent,
        DeskComponent,
        InviteDialogComponent,
        CardDeckComponent,
        NavComponent,
        MatchResultsComponent,
        MatchResultsDialogComponent,
        FormatVotePipe,
      ],
      imports: [
        ButtonComponent,
        DialogComponent,
        ReactiveFormsModule,
        AvatarComponent,
        CardComponent,
      ],
      providers: [
        { provide: MatchService, useValue: serviceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    });
    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    matchService = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle user choose', () => {
    component.handleUserChoose({ name: 'hey', mode: 'single' });
    expect(component.isUserChosed).toBeTrue();
    expect(matchService.joinMatch).toHaveBeenCalled();
  });

  it('should handle invite modal open', () => {
    component.handleInviteModalOpen();
    expect(component.isInviteModalOpen).toBeTrue();
  });

  it('should handle invite modal close', () => {
    component.handleInviteModalClose();
    expect(component.isInviteModalOpen).toBeFalse();
  });

  it('should return a name', () => {
    store.select.and.returnValue(of({ match: { name: 'hey', k: 'v' } }));
    expect(component.name).toBeTruthy();
  });

  describe('#onSelectCard', () => {
    it('should call select card on the service if a card has not been selected', () => {
      component.selectedCard = null;
      component.onSelectedCard(2);
      expect(matchService.selectCard).toHaveBeenCalled();
      expect(matchService.selectCard).toHaveBeenCalledWith(2);
    });

    it('should not call select card on the service if a card has been selected', () => {
      component.selectedCard = 2;
      component.onSelectedCard(2);
      expect(matchService.selectCard).not.toHaveBeenCalled();
    });
  });
});
