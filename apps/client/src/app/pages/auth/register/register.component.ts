import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatchService } from 'src/app/services/match/match.service';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private matchService: MatchService) {}

  formGroup = this.fb.group({
    email: this.fb.control('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.email,
      ],
    }),
    password: this.fb.control('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(8),
      ],
    }),
  });

  get email() {
    return this.formGroup.get('email')!;
  }

  get password() {
    return this.formGroup.get('password')!;
  }

  isFormValid() {
    return this.formGroup.valid;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.matchService.createMatch(this.password.value!);
    }

    this.formGroup.markAllAsTouched();
  }
}
