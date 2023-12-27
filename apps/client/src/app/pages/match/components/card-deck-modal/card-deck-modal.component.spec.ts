import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeckModalComponent } from './card-deck-modal.component';
import { MatchService } from 'src/app/services/match/match.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { from } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';

describe('CardDeckModalComponent', () => {
  let component: CardDeckModalComponent;
  let fixture: ComponentFixture<CardDeckModalComponent>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'cardDeck$',
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.cardDeck$.and.returnValue(from([1, 2, 3]));

    await TestBed.configureTestingModule({
      imports: [DialogComponent, CardComponent],
      declarations: [CardDeckModalComponent],
      providers: [
        {
          provide: MatchService,
          useValue: serviceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDeckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
