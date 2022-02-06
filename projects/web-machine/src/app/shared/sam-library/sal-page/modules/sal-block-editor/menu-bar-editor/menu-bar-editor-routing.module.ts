import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuBarEditorComponent } from './menu-bar-editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MenuBarEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuBarEditorRoutingModule {}
