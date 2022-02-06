import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'text',
    loadChildren: () =>
      import('./text-editor/text-editor.module').then((m) => m.TextModule),
  },
  {
    path: 'youtube',
    loadChildren: () =>
      import('./youtube-editor/youtube-editor.module').then(
        (m) => m.YoutubeModule
      ),
  },
  {
    path: 'menu-bar',
    loadChildren: () =>
      import('./menu-bar-editor/menu-bar-editor.module').then(
        (m) => m.MenuBarEditorModule
      ),
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./gallery-editor/gallery-editor.module').then(
        (m) => m.GalleryEditorModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalBlockEditorRoutingModule {}
