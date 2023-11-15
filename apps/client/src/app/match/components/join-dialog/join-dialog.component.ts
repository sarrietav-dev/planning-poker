import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'match-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss'],
})
export class JoinDialogComponent {
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

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
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
