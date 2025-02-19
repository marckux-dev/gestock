import {Routes} from '@angular/router';
import {LayoutComponent} from './pages/layouts/auth-layout/layout.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
// import {ForgotPasswordPageComponent} from './pages/forgot-password-page/forgot-password-page.component';

export const authRoutes : Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      // {
      //   path: 'forgot-password',
      //   component: ForgotPasswordPageComponent,
      // },
      {
        path: '**',
        redirectTo: 'login',
      }
    ]
  }
];
