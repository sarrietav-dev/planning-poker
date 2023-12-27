import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeckComponent } from './card-deck.component';
import { MatchService } from 'src/app/services/match/match.service';
import { from } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { EventEmitter } from '@angular/core';

describe('CardDeckComponent', () => {
  let component: CardDeckComponent;
  let fixture: ComponentFixture<CardDeckComponent>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'cardDeck$',
      'selectCard',
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.cardDeck$.and.returnValue(from([1, 2, 3]));

    await TestBed.configureTestingModule({
      declarations: [CardDeckComponent],
      imports: [CardComponent],
      providers: [
        {
          provide: MatchService,
          useValue: serviceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default selectedCard value as -1', () => {
    expect(component.selectedCard).toBe(-1);
  });

  it('should populate cardDeck$ from service', (done) => {
    component.cardDeck$.subscribe((value) => {
      expect(value).toEqual([1, 2, 3]); // replace with expected value
      done();
    });
  });

  it('should not change selectedCard when onSelectedCard is called and selectedCard is not -1', () => {
    component.selectedCard = 3;
    component.onSelectedCard(5);
    expect(component.selectedCard).toBe(3);
  });

  it('should emit selectCard event when onSelectedCard is called and selectedCard is -1', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', [
      'emit',
    ]) as jasmine.SpyObj<EventEmitter<number>>;
    component.cardSelect = eventEmitterSpy;
    component.onSelectedCard(5);
    expect(eventEmitterSpy.emit).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(5);
  });
});
