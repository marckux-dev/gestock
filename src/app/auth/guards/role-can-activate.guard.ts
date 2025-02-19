import { CanActivateFn, Router } from '@angular/router';
import {Role} from '../interfaces/role.enumeration';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {hasIntersection} from '../../shared/helpers/arrays.helpers';

export const roleCanActivateGuard = (roles: Role[], redirectTo?: string): CanActivateFn =>
  (route, state): boolean => {
    const authService: AuthService = inject(AuthService);
    const router     : Router      = inject(Router);
    if (!authService.isLogged()) {
      if (redirectTo) router.navigate([redirectTo]);
      return false;
    }
    const allowed: boolean = hasIntersection(roles, authService.user()!.roles)
    if (allowed) return true;
    if (redirectTo) router.navigate([redirectTo]);
    return false;
  };

