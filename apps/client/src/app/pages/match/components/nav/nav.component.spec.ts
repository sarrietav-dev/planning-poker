import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a list of three spectators', (done) => {
    component.getSpectators$().subscribe((spectators) => {
      expect(spectators.length).toBe(3);
      done();
    });
  });

  it('should return a spectator count label', () => {
    expect(component.spectatorCountLabel).toBe('1+');
  });
});
