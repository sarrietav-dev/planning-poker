import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'match-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss'],
})
export class JoinDialogComponent {
  @Output() onSubmit = new EventEmitter<{ name: string; mode: string }>();

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ],
    }),
    mode: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

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
