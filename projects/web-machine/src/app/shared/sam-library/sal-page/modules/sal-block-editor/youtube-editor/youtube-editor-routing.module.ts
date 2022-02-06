import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YoutubeEditorComponent } from './youtube-editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: YoutubeEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YoutubeRoutingModule {}
