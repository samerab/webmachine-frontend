import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shell/home/home.component';
import { ShellComponent } from './shell/shell.component';
import { ClientComponent } from './shared/shared-module/client/client.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'users/dashboard',
        loadChildren: () =>
          import('./features/user-dashboard/user-dashboard.module').then(
            (m) => m.UserDashboardModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/sign-user/sign-user.module').then(
            (m) => m.SignUserModule
          ),
      },
    ],
  },
  {
    path: 'admin',
    redirectTo: 'website',
  },
  {
    path: 'website',
    loadChildren: () =>
      import('./features/website-dashboard/website-dashboard.module').then(
        (m) => m.WebsiteDashboardModule
      ),
  },
  { path: 'homepage', component: ClientComponent },
  { path: 'page/:id', component: ClientComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'block-settings',
    outlet: 'blockSettings',
    loadChildren: () =>
      import('@ws-sal/block-settings').then((m) => m.SalBlockSettingsModule),
  },
  {
    path: 'style',
    outlet: 'style',
    loadChildren: () => import('@ws-sal/style').then((m) => m.SalStyleModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
