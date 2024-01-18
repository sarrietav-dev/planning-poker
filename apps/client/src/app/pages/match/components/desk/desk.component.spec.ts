import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeskComponent } from './desk.component';
import { MatchService } from 'src/app/services/match/match.service';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('DeskComponent', () => {
  let component: DeskComponent;
  let fixture: ComponentFixture<DeskComponent>;
  let service: jasmine.SpyObj<MatchService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', [
      'select',
      'dispatch',
    ]) as jasmine.SpyObj<Store>;

    storeSpy.select.and.returnValue(EMPTY);

    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'revealCards',
      'resetGame',
      'getAreCardsRevealed',
      'getCurrentPlayerId',
      "getPlayers"
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.getAreCardsRevealed.and.returnValue(of(false));
    serviceSpy.getCurrentPlayerId.and.returnValue("");
    serviceSpy.getPlayers.and.returnValue(of([]));

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    routeSpy.snapshot = {
      paramMap: {
        get: () => '1',
      },
    };

    await TestBed.configureTestingModule({
      declarations: [DeskComponent],
      providers: [
        {
          provide: MatchService,
          useValue: serviceSpy,
        },
        {
          provide: Store,
          useValue: storeSpy,
        },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have areCardsRevealed property initially set to false', () => {
    expect(component.areCardsRevealed).toBe(false);
  });

  it('should call revealCards method on service when onRevealCardsClick is called', () => {
    component.onRevealCardsClick();
    expect(service.revealCards).toHaveBeenCalled();
  });

  it('should call resetGame method on service when onResetGameClick is called', () => {
    component.onResetGameClick();
    expect(service.resetGame).toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    it('should set areCardsRevealed to true when the cards are revealed', () => {
      service.getAreCardsRevealed.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.areCardsRevealed).toBe(true);
    });

    it('should set areCardsRevealed to false when the cards are not revealed', () => {
      service.getAreCardsRevealed.and.returnValue(of(false));
      component.ngOnInit();
      expect(component.areCardsRevealed).toBe(false);
    });
  });

  describe('getSeatClass', () => {
    it('should return the correct class', () => {
      const seatClass = component.getSeatClass(1);
      expect(seatClass).toBe('seat seat--2');
    });
  });

  describe('didPlayerSelectCard', () => {
    it('should return false when a player does not have a card', () => {
      expect(
        component.didPlayerSelectCard({ id: '', name: '', card: -1 })
      ).toBe(false);
    });

    it('should return true when a player has a card', () => {
      expect(component.didPlayerSelectCard({ id: '', name: '', card: 2 })).toBe(
        true
      );
    });
  });

  describe('canShowResetGameButton', () => {
    it('should return false when the user is not an admin', (done) => {
      component.isAdmin$ = of(false);

      component.canShowResetGameButton.subscribe((canShow) => {
        expect(canShow).toBe(false);
        done();
      });
    });

    it('should return false when the cards are not revealed', (done) => {
      component.isAdmin$ = of(true);
      component.areCardsRevealed = false;

      component.canShowResetGameButton.subscribe((canShow) => {
        expect(canShow).toBe(false);
        done();
      });
    });

    it('should return true when the user is an admin and the cards are revealed', (done) => {
      component.isAdmin$ = of(true);
      component.areCardsRevealed = true;

      component.canShowResetGameButton.subscribe((canShow) => {
        expect(canShow).toBe(true);
        done();
      });
    });
  });

  describe('canShowRevealCardsButton', () => {
    it('should return false when the user is not an admin', (done) => {
      component.isAdmin$ = of(false);

      component.canShowRevealCardsButton.subscribe((canShow) => {
        expect(canShow).toBe(false);
        done();
      });
    });

    it('should return false when the cards are revealed', (done) => {
      component.isAdmin$ = of(true);
      component.areCardsRevealed = true;

      component.canShowRevealCardsButton.subscribe((canShow) => {
        expect(canShow).toBe(false);
        done();
      });
    });

    it('should return true when the user is an admin and the cards are not revealed', (done) => {
      component.isAdmin$ = of(true);
      component.areCardsRevealed = false;

      component.canShowRevealCardsButton.subscribe((canShow) => {
        expect(canShow).toBe(true);
        done();
      });
    });
  });
});
