import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'products',
        loadChildren: () =>
              import('../product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
              import('../page/page.module').then(m => m.PageModule)
      },
      {
        path: 'templates',
        loadChildren: () =>
              import('../template/template.module').then(m => m.TemplateModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
