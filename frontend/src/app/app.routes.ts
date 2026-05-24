import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalogo/catalogo').then(m => m.CatalogoComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent)
  },
  {
    path: 'confirmacion',
    loadComponent: () => import('./features/checkout/confirmacion/confirmacion').then(m => m.ConfirmacionComponent)
  },
  {
    path: 'locales',
    loadComponent: () => import('./features/locales/locales').then(m => m.LocalesComponent)
  },
  {
    path: '**',
    redirectTo: 'home' 
  }
];