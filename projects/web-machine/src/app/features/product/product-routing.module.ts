import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCrudComponent } from './product-crud/product-crud.component';
import { ProductsDashboardComponent } from './products-dashboard/products-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view'
  },
  {
    path: 'view',
    component: ProductsDashboardComponent,
  },
  {
    path: 'add',
    component: ProductCrudComponent,
  },
  {
    path: 'edit/:id',
    component: ProductCrudComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
