import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCrudComponent } from './page-crud/page-crud.component';
import { PagesDashboardComponent } from './pages-dashboard/pages-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view'
  },
  {
    path: 'view',
    component: PagesDashboardComponent,
  },
  {
    path: 'add',
    component: PageCrudComponent,
  },
  {
    path: 'edit/:id',
    component: PageCrudComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
