import {Component, inject, OnInit} from '@angular/core';
import {MaterialModule} from '../../../material/material/material.module';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'auth-login-page',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  standalone: true,
  styles: ``
})
export class LoginPageComponent implements OnInit {

  errorMessage?: string;

  // Dependency injection
  private fb         : FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService)
  private router     : Router      = inject(Router);

  form: FormGroup = this.fb.group({
    full_name: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(
      () => this.errorMessage = undefined
    );
  }

  onSubmit() {
    if (this.form.invalid) return;
    const {full_name, password} = this.form.value;
    this.authService.login(full_name!, password!)
      .subscribe({
        next: () => {
          // TO DELETE
          console.log('Logged successfully!');
          //
          this.router.navigate(['dashboard']);

        },
        error: (error) => {
          this.errorMessage = error.error.message;
        }
      });
  }
}
