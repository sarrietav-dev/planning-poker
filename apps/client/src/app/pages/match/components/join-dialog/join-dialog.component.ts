import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'match-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss'],
})
export class JoinDialogComponent {
  constructor(private fb: FormBuilder) { }

  @Output() onSubmit = new EventEmitter<{ name: string; mode: "player" | "spectator" }>();

  form = this.fb.group({
    name: this.fb.control('', {
      updateOn: 'submit',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[a-zA-Z])(?=(?:\D*\d){0,3}\D*$)[a-zA-Z0-9]*$/
        ),
      ],
    }),
    mode: this.fb.control<string>('', {
      validators: [Validators.required, Validators.pattern(/^(player|spectator)$/)],
    }),
  });

  isFormValid() {
    return this.form.valid;
  }

  handleSubmit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value as { name: string; mode: "player" | "spectator" });
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
