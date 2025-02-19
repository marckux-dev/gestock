import {Routes} from '@angular/router';
import {DashboardLayoutComponent} from './pages/layouts/dashboard-layout/dashboard-layout.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: ()  =>
            import('./pages/welcome-page/welcome-page.component')
              .then(c=>c.WelcomePageComponent)
      },
      {
        path: 'stock/:name',
        loadComponent: () =>
          import('../features/stocks/components/stock-list/stock-list.component')
            .then(c=>c.StockListComponent)
      },
      {
        path: 'users/register',
        loadComponent: () =>
          import('../auth/pages/register-page/register-page.component')
            .then(c=>c.RegisterPageComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../auth/pages/user-list/user-list.component')
            .then(c => c.UserListComponent)
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/products/components/product-list/product-list.component')
                .then(c=>c.ProductListComponent)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../features/products/components/product-form/product-form.component')
                .then(c=>c.ProductFormComponent)
          },
          {
            path: 'discontinued',
            loadComponent: () =>
              import('../features/products/components/product-discontinued/product-discontinued.component')
                .then(c=>c.ProductDiscontinuedComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../features/products/components/product-form/product-form.component')
                .then(c=>c.ProductFormComponent)
          },
          {
            path: '**',
            redirectTo: '',
          },
        ]
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
];
