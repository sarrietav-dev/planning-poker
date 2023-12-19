import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDialogComponent } from './join-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

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
});
