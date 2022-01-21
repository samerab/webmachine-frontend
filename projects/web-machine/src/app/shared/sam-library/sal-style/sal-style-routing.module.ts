import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StyleBuilderComponent } from './style-builder/style-builder.component';

const routes: Routes = [
  {path: '', component: StyleBuilderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalStyleRoutingModule { }
