import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent],
    });
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.selected).toBeUndefined();
    expect(component.value).toBe('');
  });

  it('should emit select event when onSelectedCard is called', () => {
    spyOn(component.select, 'emit');
    component.onSelectedCard();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should update selected value when @Input selected is changed', () => {
    component.selected = true;
    fixture.detectChanges();
    expect(component.selected).toBe(true);
  });

  it('should update value when @Input value is changed', () => {
    component.value = 'test';
    fixture.detectChanges();
    expect(component.value).toBe('test');
  });
});
