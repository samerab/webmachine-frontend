import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassicGallerySettingsComponent } from './classic-gallery-settings/classic-gallery-settings.component';
import { ImgSettingsComponent } from './img-settings/img-settings.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { VideoSettingsComponent } from './video-settings/video-settings.component';

const routes: Routes = [
  {
    path: 'img',
    component: ImgSettingsComponent
  },
  {
    path: 'video',
    component: VideoSettingsComponent
  },
  {
    path: 'classic-gallery',
    component: ClassicGallerySettingsComponent
  },
  {
    path: 'text',
    component: TextEditorComponent
  },
  {
    path: 'text/fullscreen',
    redirectTo: 'text'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockSettingsRoutingModule { }
