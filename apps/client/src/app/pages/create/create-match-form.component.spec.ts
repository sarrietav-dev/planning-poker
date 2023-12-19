import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchFormComponent } from './create-match-form.component';
import { MatchService } from 'src/app/services/match/match.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/components/button/button.component';

describe('CreateMatchFormComponent', () => {
  let component: CreateMatchFormComponent;
  let fixture: ComponentFixture<CreateMatchFormComponent>;
  let matchService: jasmine.SpyObj<MatchService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'createMatch',
    ]) as jasmine.SpyObj<MatchService>;

    TestBed.configureTestingModule({
      declarations: [CreateMatchFormComponent],
      imports: [ReactiveFormsModule, ButtonComponent],
      providers: [{ provide: MatchService, useValue: serviceSpy }],
    });
    fixture = TestBed.createComponent(CreateMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    matchService = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call matchService.createMatch with name value if form is valid', () => {
    spyOn(component, 'isFormValid').and.returnValue(true);
    spyOn(component.formGroup, 'markAllAsTouched');
    component.formGroup.get('name')?.setValue('test');

    component.onSubmit();
    expect(matchService.createMatch).toHaveBeenCalledWith('test');
    expect(component.formGroup.markAllAsTouched).toHaveBeenCalled();
  });

  it('should not call matchService.createMatch if form is invalid', () => {
    spyOn(component, 'isFormValid').and.returnValue(false);
    spyOn(component.formGroup, 'markAllAsTouched');

    component.onSubmit();

    expect(matchService.createMatch).not.toHaveBeenCalled();
    expect(component.formGroup.markAllAsTouched).toHaveBeenCalled();
  });
});
