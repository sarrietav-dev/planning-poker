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

  describe('Form valid cases', () => {
    it('should be valid if name is between 5 and 20 characters', () => {
      component.formGroup.get('name')?.setValue('Acoolname');
      expect(component.isFormValid()).toBeTrue();
    });

    it('should be valid if name contains 3 numbers', () => {
      component.formGroup.get('name')?.setValue('test123');
      expect(component.isFormValid()).toBeTrue();
    });

    it('should be valid if name starts with a number', () => {
      component.formGroup.get('name')?.setValue('1test');
      expect(component.isFormValid()).toBeTrue();
    });
  });

  describe('Form invalid cases', () => {
    it('should be invalid if name is null', () => {
      component.formGroup.get('name')?.setValue(null);
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is empty', () => {
      component.formGroup.get('name')?.setValue('');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is less than 5 characters', () => {
      component.formGroup.get('name')?.setValue('test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is more than 20 characters', () => {
      component.formGroup.get('name')?.setValue('loremipsumdolorsitamet');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains underscores', () => {
      component.formGroup.get('name')?.setValue('test_');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains dashes', () => {
      component.formGroup.get('name')?.setValue('test-');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains periods', () => {
      component.formGroup.get('name')?.setValue('test.');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains commas', () => {
      component.formGroup.get('name')?.setValue('test,test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains asterisks', () => {
      component.formGroup.get('name')?.setValue('test*');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains spaces', () => {
      component.formGroup.get('name')?.setValue('test test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains hashtags', () => {
      component.formGroup.get('name')?.setValue('test#');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name has more than 3 numbers', () => {
      component.formGroup.get('name')?.setValue('test1234');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if it has only numbers', () => {
      component.formGroup.get('name')?.setValue('1234');
      expect(component.isFormValid()).toBeFalse();
    });
  });
});
