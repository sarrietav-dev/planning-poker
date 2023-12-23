import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'match-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss'],
})
export class JoinDialogComponent {
  constructor(private fb: FormBuilder) {}

  @Output() onSubmit = new EventEmitter<{ name: string; mode: string }>();

  form = this.fb.group({
    name: this.fb.control('', {
      updateOn: 'submit',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[a-zA-Z])(?=(?:[^0-9]*[0-9]){0,3}[^0-9]*$)[a-zA-Z0-9]*$/
        ),
      ],
    }),
    mode: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });

  isFormValid() {
    return this.form.valid;
  }

  handleSubmit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value as { name: string; mode: string });
    }

    this.form.markAllAsTouched();
  }

  get name() {
    return this.form.get('name')!;
  }

  get mode() {
    return this.form.get('mode')!;
  }
}
