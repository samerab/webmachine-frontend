import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsitedashboardComponent } from './dashboard/websitedashboard.component';
import { RedirectComponent } from './redirect/redirect.component';
import { WebsiteLoginComponent } from './website-login/website-login.component';

const routes: Routes = [
  {
    path: 'redirect/:id',
    component: RedirectComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: WebsiteLoginComponent,
  },
  {
    path: 'dashboard',
    component: WebsitedashboardComponent,
    children: [
      {
        path: 'pages',
        loadChildren: () =>
          import('../page/page.module').then((m) => m.PageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteDashboardRoutingModule {}
