import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryEditorComponent } from './gallery-editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GalleryEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleryEditorRoutingModule {}
