import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const guestCanActivateGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router     : Router      = inject(Router);
  if (authService.isLogged()) router.navigate((['dashboard']));
  return !authService.isLogged();
};
