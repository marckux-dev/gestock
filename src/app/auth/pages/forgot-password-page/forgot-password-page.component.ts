import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {MaterialModule} from '../../../material/material/material.module';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'auth-forgot-password-page',
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './forgot-password-page.component.html',
  standalone: true,
  styles: ``
})
export class ForgotPasswordPageComponent {

  form: FormGroup;
  successMessage?: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    console.log('onSubmit');
  }

}
