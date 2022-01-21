import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateCrudComponent } from './template-crud/template-crud.component';
import { TemplatesBrowserComponent } from './templates-browser/templates-browser.component';

const routes: Routes = [
  {path: '', redirectTo: 'pageTemplates'},
  {path: 'add', component: TemplateCrudComponent},
  {path: 'edit/:type/:id', component: TemplateCrudComponent},
  {path: ':id', component: TemplatesBrowserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
