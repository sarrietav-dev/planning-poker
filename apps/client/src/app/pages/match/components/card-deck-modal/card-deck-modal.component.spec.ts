import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeckModalComponent } from './card-deck-modal.component';

describe('CardDeckModalComponent', () => {
  let component: CardDeckModalComponent;
  let fixture: ComponentFixture<CardDeckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDeckModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDeckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
