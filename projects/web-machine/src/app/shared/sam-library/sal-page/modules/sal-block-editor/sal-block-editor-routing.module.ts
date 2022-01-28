import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'gallery',
    loadChildren: () =>
      import('./gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'img',
    loadChildren: () => import('./img/img.module').then((m) => m.ImgModule),
  },
  {
    path: 'text',
    loadChildren: () => import('./text/text.module').then((m) => m.TextModule),
  },
  {
    path: 'youtube',
    loadChildren: () =>
      import('./youtube/youtube.module').then((m) => m.YoutubeModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalBlockEditorRoutingModule {}
