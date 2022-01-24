import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { WebsitesTemplatesBrowserComponent } from './websites-templates-browser/websites-templates-browser.component';
import { WebsiteCrudComponent } from './website-crud/website-crud.component';
import { WebsiteListComponent } from './websiteList/websiteList.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'websites',
      },
      {
        path: 'websites',
        children: [
          {
            path: '',
            component: WebsiteListComponent,
          },
          {
            path: 'templates',
            component: WebsitesTemplatesBrowserComponent,
          },
          {
            path: 'add',
            component: WebsiteCrudComponent,
            data: { status: 'add' },
          },
          {
            path: 'edit/:id',
            component: WebsiteCrudComponent,
            data: { status: 'edit' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboardRoutingModule {}
