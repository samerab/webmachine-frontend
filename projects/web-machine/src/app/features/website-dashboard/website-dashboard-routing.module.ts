import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsitedashboardComponent } from './dashboard/websitedashboard.component';
import { WebsiteLoginComponent } from './website-login/website-login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
