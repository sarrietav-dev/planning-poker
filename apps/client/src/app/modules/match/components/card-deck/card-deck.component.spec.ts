import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeckComponent } from './card-deck.component';

describe('CardDeckComponent', () => {
  let component: CardDeckComponent;
  let fixture: ComponentFixture<CardDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
