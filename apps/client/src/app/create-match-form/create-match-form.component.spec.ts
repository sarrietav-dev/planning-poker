import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchFormComponent } from './create-match-form.component';

describe('CreateMatchFormComponent', () => {
  let component: CreateMatchFormComponent;
  let fixture: ComponentFixture<CreateMatchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMatchFormComponent]
    });
    fixture = TestBed.createComponent(CreateMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
