import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDialogComponent } from './join-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { DialogComponent } from 'src/app/components/atoms/dialog/dialog.component';

describe('JoinDialogComponent', () => {
  let component: JoinDialogComponent;
  let fixture: ComponentFixture<JoinDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinDialogComponent],
      imports: [ReactiveFormsModule, ButtonComponent, DialogComponent],
    });
    fixture = TestBed.createComponent(JoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.form.get('name')?.validator).toBeDefined();
    expect(component.form.get('mode')?.validator).toBeDefined();
  });

  it('should not emit onSubmit event if form is invalid', () => {
    spyOn(component.onSubmit, 'emit');
    component.form.get('name')?.setValue('');
    component.form.get('mode')?.setValue('');
    component.handleSubmit();
    expect(component.onSubmit.emit).not.toHaveBeenCalled();
  });

  it('should emit onSubmit event with form value if form is valid', () => {
    spyOn(component.onSubmit, 'emit');
    component.form.get('name')?.setValue('testuser');
    component.form.get('mode')?.setValue('testmode');
    component.handleSubmit();
    expect(component.onSubmit.emit).toHaveBeenCalledWith({
      name: 'testuser',
      mode: 'testmode',
    });
  });

  it('should mark all fields as touched on handleSubmit', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.handleSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should return correct form controls', () => {
    expect(component.name).toBe(component.form.get('name')!);
    expect(component.mode).toBe(component.form.get('mode')!);
  });

  describe('Form valid cases', () => {
    beforeEach(() => {
      component.form.get('mode')?.setValue('testmode');
    });

    it('should be valid if name is between 5 and 20 characters', () => {
      component.name?.setValue('Acoolname');
      expect(component.isFormValid()).toBeTrue();
    });

    it('should be valid if name contains 3 numbers', () => {
      component.name?.setValue('test123');
      expect(component.isFormValid()).toBeTrue();
    });

    it('should be valid if name starts with a number', () => {
      component.name?.setValue('1test');
      expect(component.isFormValid()).toBeTrue();
    });
  });

  describe('Form invalid cases', () => {
    beforeEach(() => {
      component.form.get('mode')?.setValue('testmode');
    });

    it('should be invalid if name is null', () => {
      component.name.setValue('');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is empty', () => {
      component.form.get('name')?.setValue('');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is less than 5 characters', () => {
      component.form.get('name')?.setValue('test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name is more than 20 characters', () => {
      component.form.get('name')?.setValue('loremipsumdolorsitamet');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains underscores', () => {
      component.form.get('name')?.setValue('test_');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains dashes', () => {
      component.form.get('name')?.setValue('test-');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains periods', () => {
      component.form.get('name')?.setValue('test.');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains commas', () => {
      component.form.get('name')?.setValue('test,test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains asterisks', () => {
      component.form.get('name')?.setValue('test*');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains spaces', () => {
      component.form.get('name')?.setValue('test test');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name contains hashtags', () => {
      component.form.get('name')?.setValue('test#');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if name has more than 3 numbers', () => {
      component.form.get('name')?.setValue('test1234');
      expect(component.isFormValid()).toBeFalse();
    });

    it('should be invalid if it has only numbers', () => {
      component.form.get('name')?.setValue('1234');
      expect(component.isFormValid()).toBeFalse();
    });
  });
});
