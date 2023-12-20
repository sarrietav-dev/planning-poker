import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeskComponent } from './desk.component';
import { MatchService } from 'src/app/services/match/match.service';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

describe('DeskComponent', () => {
  let component: DeskComponent;
  let fixture: ComponentFixture<DeskComponent>;
  let service: jasmine.SpyObj<MatchService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']) as jasmine.SpyObj<Store>;

    storeSpy.select.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [DeskComponent],
      providers: [
        {
          provide: MatchService,
          useValue: jasmine.createSpyObj('MatchService', [
            'revealCards',
            'resetGame',
          ]),
        },
        {
          provide: Store,
          useValue: storeSpy,
        },
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

  it('should return an empty string when getCardValue is called with null', () => {
    expect(component.getCardValue(null)).toBe('');
  });

  it('should return an empty string when getCardValue is called with undefined', () => {
    expect(component.getCardValue(undefined)).toBe('');
  });
});
