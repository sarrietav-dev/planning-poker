import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatchService } from '../core/services/match/match.service';

@Component({
  selector: 'app-create-match-form',
  templateUrl: './create-match-form.component.html',
  styleUrls: ['./create-match-form.component.scss'],
})
export class CreateMatchFormComponent {
  constructor(private fb: FormBuilder, private matchService: MatchService) {}

  formGroup = this.fb.group({
    name: this.fb.control('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ],
    }),
  });

  get name() {
    return this.formGroup.get('name')!;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.matchService
        .createMatch(this.name.value!)
        ;
    }

    this.formGroup.markAllAsTouched();
  }
}
