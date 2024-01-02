import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultsDialogComponent } from './match-results-dialog.component';

describe('MatchResultsDialogComponent', () => {
  let component: MatchResultsDialogComponent;
  let fixture: ComponentFixture<MatchResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchResultsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
