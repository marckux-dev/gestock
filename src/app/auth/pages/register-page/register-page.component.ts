import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {catchError, throwError} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PasswordModalComponent} from '../../components/password-modal/password-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'auth-register-page',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    NgIf
  ],
  templateUrl: './register-page.component.html',
  standalone: true,
  styles: ``
})
export class RegisterPageComponent {


  // Dependency injection
  private fb         : FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private dialog     : MatDialog   = inject(MatDialog);
  private router     : Router      = inject(Router);

  form: FormGroup = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
  });

  errorMessage?: string;

  onSubmit(): void {
    if (this.form.invalid) return;
    const { full_name } = this.form.value;
    this.authService.register(full_name)
      .pipe(
        catchError(
          httpError => {
            this.errorMessage = httpError.error.message;
            return throwError(()=>httpError);
          }
        )
      )
      .subscribe(
        resp => {
          this.errorMessage = undefined;
          this.dialog.open(PasswordModalComponent, {
            data: { password: resp.password }
          });
          this.router.navigate(['dashboard', 'users']);
        }
      )
  }

}
