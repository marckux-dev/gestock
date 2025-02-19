import { Routes } from '@angular/router';
import {authCanActivateGuard} from './auth/guards/auth-can-activate.guard';
import {guestCanActivateGuard} from './auth/guards/guest-can-activate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestCanActivateGuard],
    loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authCanActivateGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
