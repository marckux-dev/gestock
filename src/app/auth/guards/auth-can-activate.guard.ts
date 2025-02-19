import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authCanActivateGuard: CanActivateFn = (route, state): boolean => {
  const authService: AuthService = inject(AuthService);
  const router     : Router      = inject(Router);
  if (!authService.isLogged()) router.navigate((['auth', 'login']));
  return authService.isLogged()
};
