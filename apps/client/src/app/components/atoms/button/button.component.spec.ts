import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.color).toBe('primary');
    expect(component.variant).toBeUndefined();
    expect(component.disabled).toBe(false);
    expect(component.type).toBe('button');
  });

  it('should generate className correctly', () => {
    component.color = 'secondary';
    component.variant = 'outlined';
    expect(component.className).toBe('btn btn--secondary btn--outlined');

    component.variant = undefined;
    expect(component.className).toBe('btn btn--secondary ');
  });

  it('should emit onClick event when handleClick is called', () => {
    spyOn(component.onClick, 'emit');
    component.handleClick();
    expect(component.onClick.emit).toHaveBeenCalled();
  });
});
