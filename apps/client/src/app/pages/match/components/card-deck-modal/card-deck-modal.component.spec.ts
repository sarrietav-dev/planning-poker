import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CardDeckModalComponent } from './card-deck-modal.component';
import { MatchService } from 'src/app/services/match/match.service';
import { DialogComponent } from 'src/app/components/atoms/dialog/dialog.component';
import { from, of } from 'rxjs';
import { CardComponent } from 'src/app/components/atoms/card/card.component';

describe('CardDeckModalComponent', () => {
  let component: CardDeckModalComponent;
  let fixture: ComponentFixture<CardDeckModalComponent>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'cardDeck$',
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.cardDeck$.and.returnValue(of([1, 2, 3]));

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

  it('should update selectedCard and emit cardSelect event', fakeAsync(() => {
    spyOn(component.cardSelect, 'emit');

    const card = 5;
    component.selectCard(card);

    expect(component.selectedCard).toBe(card);
    tick(1000);
    expect(component.cardSelect.emit).toHaveBeenCalledWith(card);
  }));
});
