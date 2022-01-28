import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextComponent } from './text.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TextComponent,
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
