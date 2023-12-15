import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AvatarComponent],
    });
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return customPrefix if defined', () => {
    component.customPrefix = 'CP';
    expect(component.namePrefix).toBe('CP');
  });

  it('should return first two characters of name if customPrefix is not defined', () => {
    component.name = 'Avatar';
    expect(component.namePrefix).toBe('Av');
  });

  it('should return empty string if customPrefix and name are not defined', () => {
    expect(component.namePrefix).toBe('');
  });

  it('should return correct background color if backgroundColor is default', () => {
    component.backgroundColor = 'default';
    expect(component.bgColor).toBe('var(--somewhat-blue)');
  });
});
