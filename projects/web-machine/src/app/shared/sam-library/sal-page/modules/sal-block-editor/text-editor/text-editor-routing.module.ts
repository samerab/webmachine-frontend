import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextEditorComponent } from './text-editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TextEditorComponent,
  },
  {
    path: 'fullscreen',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextRoutingModule {}
